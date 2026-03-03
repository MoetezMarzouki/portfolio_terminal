/**
 * ProfileCard component - vanilla TypeScript implementation
 * Displays an interactive 3D profile card with tilt effects
 */

interface ProfileCardOptions {
  avatarUrl: string;
  miniAvatarUrl?: string;
  name: string;
  title: string;
  handle: string;
  status?: string;
  contactText?: string;
  iconUrl?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  enableTilt?: boolean;
}

export class ProfileCard {
  private wrapperEl: HTMLDivElement;
  private shellEl: HTMLDivElement;
  private cardEl: HTMLDivElement;
  private options: ProfileCardOptions;
  private currentX = 0;
  private currentY = 0;
  private targetX = 0;
  private targetY = 0;
  private rafId: number | null = null;
  private isActive = false;

  constructor(options: ProfileCardOptions) {
    this.options = {
      status: 'Available',
      contactText: 'Contact',
      behindGlowEnabled: true,
      enableTilt: true,
      innerGradient: 'linear-gradient(145deg, #60496e8c 0%, #71C4FF44 100%)',
      iconUrl: '',
      ...options,
    };

    this.wrapperEl = document.createElement('div');
    this.shellEl = document.createElement('div');
    this.cardEl = document.createElement('div');

    this.render();
    this.setupEventListeners();
  }

  private render(): void {
    // Wrapper
    this.wrapperEl.className = 'pc-card-wrapper';
    this.wrapperEl.style.setProperty('--inner-gradient', this.options.innerGradient!);
    if (this.options.iconUrl) {
      this.wrapperEl.style.setProperty('--icon', `url(${this.options.iconUrl})`);
    }

    // Behind glow
    if (this.options.behindGlowEnabled) {
      const behindEl = document.createElement('div');
      behindEl.className = 'pc-behind';
      this.wrapperEl.appendChild(behindEl);
    }

    // Shell
    this.shellEl.className = 'pc-card-shell';

    // Card
    this.cardEl.className = 'pc-card';

    // Inside container
    const insideEl = document.createElement('div');
    insideEl.className = 'pc-inside';

    // Glare layer
    const glareEl = document.createElement('div');
    glareEl.className = 'pc-glare';

    // Avatar content
    const avatarContentEl = document.createElement('div');
    avatarContentEl.className = 'pc-avatar-content';

    const avatarImg = document.createElement('img');
    avatarImg.className = 'avatar';
    avatarImg.src = this.options.avatarUrl;
    avatarImg.alt = this.options.name;
    avatarContentEl.appendChild(avatarImg);

    // User info
    const userInfoEl = document.createElement('div');
    userInfoEl.className = 'pc-user-info';
    userInfoEl.innerHTML = `
      <div class="pc-user-details">
        <div class="pc-mini-avatar">
          <img src="${this.options.miniAvatarUrl || this.options.avatarUrl}" alt="${this.options.name}" />
        </div>
        <div class="pc-user-text">
          <div class="pc-handle">@${this.options.handle}</div>
          <div class="pc-status">${this.options.status}</div>
        </div>
      </div>
      <button class="pc-contact-btn">${this.options.contactText}</button>
    `;
    avatarContentEl.appendChild(userInfoEl);

    // Assemble
    insideEl.appendChild(glareEl);
    insideEl.appendChild(avatarContentEl);

    this.cardEl.appendChild(insideEl);
    this.shellEl.appendChild(this.cardEl);
    this.wrapperEl.appendChild(this.shellEl);

    // Initialize center position
    this.updateCSSVariables(0, 0);
  }

  private setupEventListeners(): void {
    if (!this.options.enableTilt) return;

    this.cardEl.addEventListener('pointerenter', this.handlePointerEnter.bind(this));
    this.cardEl.addEventListener('pointermove', this.handlePointerMove.bind(this));
    this.cardEl.addEventListener('pointerleave', this.handlePointerLeave.bind(this));
  }

  private handlePointerEnter(e: PointerEvent): void {
    this.isActive = true;
    this.wrapperEl.classList.add('active');
    this.shellEl.classList.add('entering');
    this.cardEl.classList.add('active');

    setTimeout(() => {
      this.shellEl.classList.remove('entering');
    }, 180);

    const rect = this.cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.setTarget(x, y);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isActive) return;

    const rect = this.cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.setTarget(x, y);
  }

  private handlePointerLeave(): void {
    this.isActive = false;
    this.wrapperEl.classList.remove('active');
    this.cardEl.classList.remove('active');

    const rect = this.cardEl.getBoundingClientRect();
    this.setTarget(rect.width / 2, rect.height / 2);
  }

  private setTarget(x: number, y: number): void {
    this.targetX = x;
    this.targetY = y;
    this.startAnimation();
  }

  private startAnimation(): void {
    if (this.rafId !== null) return;

    const animate = (): void => {
      const dx = this.targetX - this.currentX;
      const dy = this.targetY - this.currentY;

      this.currentX += dx * 0.14;
      this.currentY += dy * 0.14;

      this.updateCSSVariables(this.currentX, this.currentY);

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        this.rafId = requestAnimationFrame(animate);
      } else {
        this.rafId = null;
      }
    };

    this.rafId = requestAnimationFrame(animate);
  }

  private updateCSSVariables(x: number, y: number): void {
    const rect = this.cardEl.getBoundingClientRect();
    const width = rect.width || 1;
    const height = rect.height || 1;

    const percentX = Math.max(0, Math.min(100, (100 / width) * x));
    const percentY = Math.max(0, Math.min(100, (100 / height) * y));

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const fromCenter = Math.min(1, Math.hypot(centerY, centerX) / 50);

    this.wrapperEl.style.setProperty('--pointer-x', `${percentX}%`);
    this.wrapperEl.style.setProperty('--pointer-y', `${percentY}%`);
    this.wrapperEl.style.setProperty('--pointer-from-center', `${fromCenter}`);
    this.wrapperEl.style.setProperty('--pointer-from-top', `${percentY / 100}`);
    this.wrapperEl.style.setProperty('--pointer-from-left', `${percentX / 100}`);
    this.wrapperEl.style.setProperty('--rotate-x', `${-(centerX / 5)}deg`);
    this.wrapperEl.style.setProperty('--rotate-y', `${centerY / 4}deg`);
    this.wrapperEl.style.setProperty(
      '--background-x',
      `${35 + ((65 - 35) * percentX) / 100}%`
    );
    this.wrapperEl.style.setProperty(
      '--background-y',
      `${35 + ((65 - 35) * percentY) / 100}%`
    );
  }

  public getElement(): HTMLElement {
    return this.wrapperEl;
  }

  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.wrapperEl.remove();
  }
}
