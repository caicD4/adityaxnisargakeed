/**
 * ProjectsManager
 * Handles dynamic project list rendering, accordion detail expansion,
 * hover/touch interactions, other-row dimming, and Escape key dismissal.
 */

export class ProjectsManager {
  constructor(options = {}) {
    this.container = options.container || document.querySelector('.section-projects');
    this.projects = options.projects || window.PORTFOLIO_CONFIG?.projects || [];
    this.selectedProjectId = null;
    this.leaveTimeout = null;

    this.isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    window.matchMedia('(hover: none), (pointer: coarse)').addEventListener('change', (e) => {
      this.isCoarsePointer = e.matches;
    });

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = '';

    const list = document.createElement('ul');
    list.className = 'list-rows project-list';
    list.setAttribute('role', 'list');
    this.listEl = list;

    this.projects.forEach(project => {
      const hasDetails = !!project.details;
      const isSelected = this.selectedProjectId === project.id;
      const isDimmed = !!this.selectedProjectId && !isSelected;

      const row = document.createElement('li');
      row.className = [
        'list-row',
        'project-row',
        hasDetails ? 'has-details' : '',
        isSelected ? 'is-selected' : '',
        isDimmed ? 'is-dimmed' : ''
      ].filter(Boolean).join(' ');
      row.dataset.projectId = project.id;

      const inline = document.createElement('span');
      inline.className = 'project-inline';

      // Title element (link, button, or span)
      if (project.href) {
        const a = document.createElement('a');
        a.href = project.href;
        a.className = `link-row project-title-link${hasDetails ? ' has-details' : ''}`;
        a.target = '_blank';
        a.rel = 'noreferrer noopener';
        a.textContent = project.title;
        inline.appendChild(a);
      } else if (hasDetails && this.isCoarsePointer) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'project-title-btn';
        btn.setAttribute('aria-expanded', isSelected ? 'true' : 'false');
        btn.setAttribute('aria-controls', `project-detail-${project.id}`);
        btn.textContent = project.title;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleProject(project.id);
        });
        inline.appendChild(btn);
      } else if (hasDetails) {
        const span = document.createElement('span');
        span.className = 'project-title project-title--detail';
        if (isSelected) span.setAttribute('aria-describedby', `project-detail-${project.id}`);
        span.textContent = project.title;
        inline.appendChild(span);
      } else {
        const span = document.createElement('span');
        span.className = 'project-title';
        span.textContent = project.title;
        inline.appendChild(span);
      }

      // Status element
      const statusSpan = document.createElement('span');
      statusSpan.className = 'project-status';
      statusSpan.setAttribute('aria-hidden', 'true');
      statusSpan.textContent = `(${project.status})`;
      inline.appendChild(statusSpan);

      row.appendChild(inline);

      // Detail card if selected
      if (isSelected && project.details) {
        const detailWrap = document.createElement('div');
        detailWrap.id = `project-detail-${project.id}`;
        detailWrap.appendChild(this.buildDetailElement(project));
        row.appendChild(detailWrap);
      }

      // Hover events for desktop
      if (hasDetails && !this.isCoarsePointer) {
        row.addEventListener('mouseenter', () => this.handleMouseEnter(project.id));
        row.addEventListener('mouseleave', () => this.handleMouseLeave());
      } else if (hasDetails) {
        row.addEventListener('click', (e) => {
          if (!e.target.closest('a')) {
            this.toggleProject(project.id);
          }
        });
      }

      list.appendChild(row);
    });

    if (this.selectedProjectId) {
      list.classList.add('has-selection');
    }

    this.container.appendChild(list);
  }

  buildDetailElement(project) {
    const details = project.details;
    const detail = document.createElement('div');
    detail.className = 'project-detail';
    detail.setAttribute('role', 'region');
    detail.setAttribute('aria-label', `${project.title} details`);

    const rule = document.createElement('div');
    rule.className = 'project-detail-rule';
    rule.setAttribute('aria-hidden', 'true');
    detail.appendChild(rule);

    if (details.summary) {
      const summary = document.createElement('p');
      summary.className = 'project-detail-summary';
      summary.textContent = details.summary;
      detail.appendChild(summary);
    }

    if (details.expectedFeatures && details.expectedFeatures.length > 0) {
      const block = document.createElement('div');
      block.className = 'project-detail-block';
      const label = document.createElement('p');
      label.className = 'project-detail-label';
      label.textContent = 'Expected Features';
      block.appendChild(label);

      const ul = document.createElement('ul');
      ul.className = 'project-detail-list';
      details.expectedFeatures.forEach(feat => {
        const li = document.createElement('li');
        li.textContent = feat;
        ul.appendChild(li);
      });
      block.appendChild(ul);
      detail.appendChild(block);
    }

    if (details.role) {
      const block = document.createElement('div');
      block.className = 'project-detail-block';
      const label = document.createElement('p');
      label.className = 'project-detail-label';
      label.textContent = 'Role';
      block.appendChild(label);

      const val = document.createElement('p');
      val.className = 'project-detail-value';
      val.textContent = details.role;
      block.appendChild(val);
      detail.appendChild(block);
    }

    if (details.stack && details.stack.length > 0) {
      const block = document.createElement('div');
      block.className = 'project-detail-block';
      const label = document.createElement('p');
      label.className = 'project-detail-label';
      label.textContent = 'Stack';
      block.appendChild(label);

      const ul = document.createElement('ul');
      ul.className = 'project-detail-list project-detail-list--plain';
      details.stack.forEach(tech => {
        const li = document.createElement('li');
        li.textContent = tech;
        ul.appendChild(li);
      });
      block.appendChild(ul);
      detail.appendChild(block);
    }

    if (details.highlights && details.highlights.length > 0) {
      const block = document.createElement('div');
      block.className = 'project-detail-block';
      const label = document.createElement('p');
      label.className = 'project-detail-label';
      label.textContent = 'Highlights';
      block.appendChild(label);

      const ul = document.createElement('ul');
      ul.className = 'project-detail-list project-detail-list--bullets';
      details.highlights.forEach(h => {
        const li = document.createElement('li');
        li.textContent = h;
        ul.appendChild(li);
      });
      block.appendChild(ul);
      detail.appendChild(block);
    }

    if (project.href) {
      const wrap = document.createElement('p');
      wrap.className = 'project-detail-link-wrap';
      const a = document.createElement('a');
      a.href = project.href;
      a.className = 'project-detail-link';
      a.target = '_blank';
      a.rel = 'noreferrer noopener';
      const cleanUrl = project.href.replace(/^https?:\/\//, '').replace(/\/$/, '');
      a.textContent = `${cleanUrl} ↗`;
      wrap.appendChild(a);
      detail.appendChild(wrap);
    }

    return detail;
  }

  handleMouseEnter(projectId) {
    this.clearLeaveTimeout();
    this.selectProject(projectId);
  }

  handleMouseLeave() {
    this.clearLeaveTimeout();
    this.leaveTimeout = window.setTimeout(() => {
      this.selectProject(null);
      this.leaveTimeout = null;
    }, 120);
  }

  clearLeaveTimeout() {
    if (this.leaveTimeout !== null) {
      window.clearTimeout(this.leaveTimeout);
      this.leaveTimeout = null;
    }
  }

  selectProject(projectId) {
    if (this.selectedProjectId === projectId) return;
    this.selectedProjectId = projectId;
    this.render();
  }

  toggleProject(projectId) {
    this.selectProject(this.selectedProjectId === projectId ? null : projectId);
  }

  bindEvents() {
    // Keyboard dismissal with Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.selectedProjectId) {
        this.clearLeaveTimeout();
        this.selectProject(null);
      }
    });

    // Dismiss on click outside
    document.addEventListener('click', (e) => {
      if (this.selectedProjectId && !this.container.contains(e.target)) {
        this.selectProject(null);
      }
    });
  }
}
