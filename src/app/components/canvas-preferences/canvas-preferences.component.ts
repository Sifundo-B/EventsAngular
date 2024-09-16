import { Component, ElementRef, ViewChild, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PreferenceService } from 'src/app/services/preference.service';
import { UserDataService } from 'src/app/services/user-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-canvas-preferences',
  templateUrl: './canvas-preferences.component.html',
  styleUrls: ['./canvas-preferences.component.scss']
})
export class CanvasPreferencesComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
  @ViewChild('backgroundCanvas', { static: true }) backgroundCanvas: ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
  private bgCtx!: CanvasRenderingContext2D;
  private ctx!: CanvasRenderingContext2D;
  categories = [
    { id: 1, name: 'Music' },
    { id: 2, name: 'Sports' },
    { id: 3, name: 'Technology' },
    { id: 4, name: 'Food' },
    { id: 5, name: 'Arts' },
    { id: 6, name: 'Cycling' },
    { id: 7, name: 'Fighting' },
    { id: 9, name: 'Soccer' },
    { id: 10, name: 'Dance' },
    { id: 11, name: 'Sky diving' },
    { id: 12, name: 'Cars' }
    ];
  selectedCategories: string[] = [];
  bubbles: {
    size: number; category: string, x: number, y: number, dx: number, dy: number 
}[] = [];
  particles: { x: number, y: number, size: number, dx: number, dy: number }[] = [];
  animationFrameId: number = 0;
  backgroundAnimationFrameId: number = 0;
  username: string | null = null;

  constructor(
    private authService: AuthService, 
    private preferenceService: PreferenceService, 
    private router: Router, 
    private userDataService: UserDataService // Inject the shared service
  ) {}

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.bgCtx = this.backgroundCanvas.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    this.initializeParticles();
    this.loadPreferences();
    this.initializeBubbles();
    this.animate();
    this.animateBackground();
    this.loadUsername();

    // Subscribe to user data changes
    this.userDataService.user$.subscribe(user => {
      if (user) {
        this.username = user.firstName; // Update username when user data changes
      }
    });
  }

  loadUsername() {
    this.username = this.authService.getUsername();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.backgroundCanvas.nativeElement.width = window.innerWidth;
    this.backgroundCanvas.nativeElement.height = window.innerHeight;
    this.initializeBubbles(); // Reinitialize bubbles to fit the new canvas size
    this.drawBubbles();
  }

  loadPreferences() {
    this.preferenceService.getPreferences().subscribe(preferences => {
      const selectedIds = preferences.map((pref: any) => pref.category.id);
      this.selectedCategories = this.categories
        .filter(category => selectedIds.includes(category.id))
        .map(category => category.name);
      this.drawBubbles(); // Re-draw bubbles based on the selected categories
    });
  }

  initializeParticles() {
    this.particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2
    }));
  }

  animateBackground() {
    this.bgCtx.clearRect(0, 0, this.backgroundCanvas.nativeElement.width, this.backgroundCanvas.nativeElement.height);

    this.particles.forEach(particle => {
      this.bgCtx.beginPath();
      this.bgCtx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
      this.bgCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.bgCtx.fill();
      this.bgCtx.closePath();

      particle.x += particle.dx;
      particle.y += particle.dy;

      if (particle.x + particle.size > window.innerWidth || particle.x - particle.size < 0) {
        particle.dx = -particle.dx;
      }
      if (particle.y + particle.size > window.innerHeight || particle.y - particle.size < 0) {
        particle.dy = -particle.dy;
      }
    });

    this.backgroundAnimationFrameId = requestAnimationFrame(() => this.animateBackground());
  }

  initializeBubbles() {
    const baseSize = Math.min(window.innerWidth, window.innerHeight) * 0.16; // Adjust size proportionally
    this.bubbles = this.categories.map(category => ({
      category: category.name,
      x: Math.random() * (window.innerWidth - baseSize * 2) + baseSize, // Ensure bubbles stay within bounds
      y: Math.random() * (window.innerHeight - baseSize * 2) + baseSize, // Ensure bubbles stay within bounds
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      size: baseSize // Set bubble size
    }));
  }

  detectCollisions() {
    for (let i = 0; i < this.bubbles.length; i++) {
      for (let j = i + 1; j < this.bubbles.length; j++) {
        const bubble1 = this.bubbles[i];
        const bubble2 = this.bubbles[j];
  
        const dx = bubble1.x - bubble2.x;
        const dy = bubble1.y - bubble2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = bubble1.size + bubble2.size;
  
        if (distance < minDistance) {
          // Collision detected, adjust positions
          const overlap = minDistance - distance;
          const angle = Math.atan2(dy, dx);
          bubble1.x += Math.cos(angle) * overlap / 2;
          bubble1.y += Math.sin(angle) * overlap / 2;
          bubble2.x -= Math.cos(angle) * overlap / 2;
          bubble2.y -= Math.sin(angle) * overlap / 2;
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  
    const baseSize = Math.min(window.innerWidth, window.innerHeight) * 0.1;
  
    this.bubbles.forEach(bubble => {
      this.ctx.beginPath();
  
      const pulsate = this.selectedCategories.includes(bubble.category) ? Math.sin(Date.now() / 500) * 5 + bubble.size : bubble.size;
  
      this.ctx.arc(bubble.x, bubble.y, pulsate, 0, 2 * Math.PI);
      const gradient = this.ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, pulsate);
      gradient.addColorStop(0, this.selectedCategories.includes(bubble.category) ? '#ff6347' : '#0099ff');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
  
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = `${Math.max(16, baseSize / 5)}px Arial`;
      this.ctx.fillText(bubble.category, bubble.x, bubble.y);
      this.ctx.closePath();
  
      bubble.x += bubble.dx;
      bubble.y += bubble.dy;
  
      // Ensure bubbles stay within the viewport
      if (bubble.x + pulsate > window.innerWidth) {
        bubble.x = window.innerWidth - pulsate;
        bubble.dx = -bubble.dx;
      } else if (bubble.x - pulsate < 0) {
        bubble.x = pulsate;
        bubble.dx = -bubble.dx;
      }
      if (bubble.y + pulsate > window.innerHeight) {
        bubble.y = window.innerHeight - pulsate;
        bubble.dy = -bubble.dy;
      } else if (bubble.y - pulsate < 0) {
        bubble.y = pulsate;
        bubble.dy = -bubble.dy;
      }
    });
  
    this.detectCollisions(); // Check for collisions
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
  
  
  

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    cancelAnimationFrame(this.backgroundAnimationFrameId);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.bubbles.forEach(bubble => {
      const dist = Math.sqrt((mouseX - bubble.x) ** 2 + (mouseY - bubble.y) ** 2);
      if (dist < 50) {
        if (this.selectedCategories.includes(bubble.category)) {
          this.selectedCategories = this.selectedCategories.filter(cat => cat !== bubble.category);
        } else {
          this.selectedCategories.push(bubble.category);
        }
        this.drawBubbles();
      }
    });
  } 
  
  
  drawBubbles() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  
    this.bubbles.forEach(bubble => {
      this.ctx.beginPath();
      
      // Create gradient
      const gradient = this.ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, 50);
      gradient.addColorStop(0, this.selectedCategories.includes(bubble.category) ? '#ff6347' : '#0099ff');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
      // Set shadow
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowOffsetY = 2;
  
      this.ctx.arc(bubble.x, bubble.y, 60, 0, 2 * Math.PI);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // Reset shadow
      this.ctx.shadowColor = 'transparent';
  
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = '16px Arial';
      this.ctx.fillText(bubble.category, bubble.x, bubble.y);
      this.ctx.closePath();
    });
  }
  

  savePreferences() {
    const categoryIds = this.selectedCategories.map(category => {
      const matchedCategory = this.categories.find(cat => cat.name === category);
      return matchedCategory ? matchedCategory.id : null;
    }).filter(id => id !== null) as number[];
  
    this.preferenceService.updatePreferences(categoryIds).subscribe(response => {
      Swal.fire('Success', 'Preferences updated!', 'success').then(() => {
        this.router.navigate(['/home']);
      });
    }, error => {
      console.error('Error updating preferences', error);
      Swal.fire('Error', 'Error updating preferences: ' + (error.error?.message || 'Unknown error'), 'error');
    });
  }
}