import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { UploadService, UploadedFile } from '../../../core/services/upload.service';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../../../core/models/course.model';
import { DialogService, DialogRef, DIALOG_DATA } from '../../../core/services/dialog.service';

interface PendingUpload {
  file: File;
  name: string;
  kind: 'VIDEO' | 'PDF' | 'OTHER';
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  url?: string;
  error?: string;
}

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles: [`
    .upload-dropzone {
      border: 2px dashed #cbd5e1;
      border-radius: 14px;
      padding: 2rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: all .2s;
      background: var(--surface-muted);
    }
    .upload-dropzone:hover, .upload-dropzone.dragover {
      border-color: #2b3ea8;
      background: #eef0fb;
    }
  `],
  template: `
    <div class="fade-in-up">
      <div *ngIf="!inDialog" class="d-flex align-items-center gap-3 mb-4">
        <a routerLink="/teacher/courses" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-arrow-left"></i>
        </a>
        <div>
          <h1 class="fw-bold mb-0"><i class="bi bi-stars me-1"></i>Créer un cours</h1>
          <p class="text-muted mb-0 small">Remplissez les informations de votre cours</p>
        </div>
      </div>

      <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
        <div class="row g-4">
          <!-- Main Info -->
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm p-4 mb-4" style="border-radius:16px">
              <h5 class="fw-bold mb-4"><i class="bi bi-journal-text me-1"></i>Informations générales</h5>

              <div class="mb-3">
                <label class="form-label fw-semibold">Titre du cours *</label>
                <input type="text" class="form-control" formControlName="title"
                  placeholder="Ex: Maîtrisez Java en 30 jours"
                  [class.is-invalid]="courseForm.get('title')?.invalid && courseForm.get('title')?.touched">
                <div class="invalid-feedback">Le titre est obligatoire</div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Description *</label>
                <textarea class="form-control" rows="5" formControlName="description"
                  placeholder="Décrivez votre cours, ce que les étudiants vont apprendre..."></textarea>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Catégorie *</label>
                  <select class="form-select" formControlName="category">
                    <option value="">Choisir une catégorie</option>
                    <option *ngFor="let cat of categories" [value]="cat.key">{{ cat.label }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Niveau *</label>
                  <select class="form-select" formControlName="level">
                    <option *ngFor="let l of courseLevels" [value]="l.key">{{ l.label }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Upload multiple fichiers / vidéos -->
            <div class="card border-0 shadow-sm p-4 mb-4" style="border-radius:16px">
              <h5 class="fw-bold mb-2"><i class="bi bi-upload me-1"></i>Importer des fichiers</h5>
              <p class="text-muted small mb-3">Sélectionnez plusieurs vidéos et/ou documents (PDF, Word) en une seule fois. Une leçon sera créée automatiquement pour chaque fichier.</p>

              <div class="upload-dropzone"
                   [class.dragover]="isDragOver"
                   (dragover)="onDragOver($event)"
                   (dragleave)="isDragOver=false"
                   (drop)="onDrop($event)"
                   (click)="fileInput.click()">
                <input #fileInput type="file" multiple hidden
                       accept="video/*,.pdf,.doc,.docx"
                       (change)="onFilesSelected($event)">
                <div style="font-size:2rem"><i class="bi bi-folder"></i></div>
                <p class="fw-semibold mb-1">Cliquez ou déposez vos fichiers ici</p>
                <p class="text-muted small mb-0">Vidéos (MP4, WebM...) et documents (PDF, Word) — plusieurs fichiers à la fois</p>
              </div>

              <div *ngIf="pendingUploads.length" class="mt-3 d-flex flex-column gap-2">
                <div *ngFor="let u of pendingUploads; let i = index"
                     class="d-flex align-items-center gap-2 p-2 border rounded-3" style="background:var(--surface-muted)">
                  <span style="font-size:1.3rem"><i class="bi" [ngClass]="u.kind === 'VIDEO' ? 'bi-camera-reels' : (u.kind === 'PDF' ? 'bi-file-earmark-text' : 'bi-paperclip')"></i></span>
                  <div class="flex-grow-1" style="min-width:0">
                    <div class="small fw-semibold text-truncate">{{ u.name }}</div>
                    <div class="progress" style="height:5px" *ngIf="u.status==='uploading'">
                      <div class="progress-bar" [style.width.%]="u.progress"></div>
                    </div>
                    <div class="small text-success" *ngIf="u.status==='done'"><i class="bi bi-check-circle me-1"></i>Importé — leçon créée</div>
                    <div class="small text-danger" *ngIf="u.status==='error'"><i class="bi bi-x-circle me-1"></i>{{ u.error }}</div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-secondary" *ngIf="u.status==='pending'" (click)="removePending(i)">
                    <i class="bi bi-x"></i>
                  </button>
                </div>

                <button type="button" class="btn btn-primary-custom btn-sm mt-1" *ngIf="hasPendingFiles()"
                        (click)="uploadAllPending()" [disabled]="uploadingAll">
                  <span *ngIf="uploadingAll" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!uploadingAll" class="bi bi-cloud-upload me-1"></i>
                  {{ uploadingAll ? 'Import en cours...' : 'Importer ' + pendingCount() + ' fichier(s)' }}
                </button>
              </div>
            </div>

            <!-- Lessons -->
            <div class="card border-0 shadow-sm p-4" style="border-radius:16px">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0"><i class="bi bi-clipboard-check me-1"></i>Leçons</h5>
                <button type="button" class="btn btn-sm btn-primary-custom" (click)="addLesson()">
                  <i class="bi bi-plus-circle me-1"></i>Ajouter une leçon
                </button>
              </div>

              <div *ngIf="lessons.length === 0" class="text-center py-4 text-muted bg-light rounded-3">
                <div style="font-size:2rem"><i class="bi bi-inbox"></i></div>
                <p class="mb-0 small">Ajoutez des leçons à votre cours, ou importez des fichiers ci-dessus</p>
              </div>

              <div formArrayName="lessons">
                <div *ngFor="let lesson of lessons.controls; let i = index" [formGroupName]="i"
                     class="border rounded-3 p-3 mb-3" style="background:var(--surface-muted)">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="fw-semibold">Leçon {{ i+1 }}</span>
                    <button type="button" class="btn btn-sm btn-outline-danger" (click)="removeLesson(i)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>

                  <div class="row g-2 mb-2">
                    <div class="col-md-8">
                      <input type="text" class="form-control form-control-sm" formControlName="title"
                        placeholder="Titre de la leçon">
                    </div>
                    <div class="col-md-4">
                      <select class="form-select form-select-sm" formControlName="type">
                        <option value="VIDEO">Vidéo</option>
                        <option value="PDF">PDF</option>
                        <option value="CODE_EXERCISE">Exercice code</option>
                        <option value="EXCEL_EXERCISE">Exercice Excel</option>
                        <option value="QUIZ">Quiz</option>
                      </select>
                    </div>
                  </div>

                  <div class="row g-2">
                    <div class="col-md-8">
                      <input type="text" class="form-control form-control-sm" formControlName="description"
                        placeholder="Description courte">
                    </div>
                    <div class="col-md-4">
                      <div class="input-group input-group-sm">
                        <input type="number" class="form-control" formControlName="duration" placeholder="Durée">
                        <span class="input-group-text">min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm p-4 mb-4" style="border-radius:16px; position:sticky; top: 80px">
              <h5 class="fw-bold mb-4"><i class="bi bi-gear me-1"></i>Paramètres</h5>

              <div class="mb-4">
                <div class="form-check form-switch">
                  <input type="checkbox" class="form-check-input" id="publishSwitch" formControlName="published" style="width:48px;height:24px">
                  <label class="form-check-label fw-semibold ms-2" for="publishSwitch">
                    {{ courseForm.get('published')?.value ? 'Publié' : 'Brouillon' }}
                  </label>
                </div>
                <p class="text-muted small mt-1">{{ courseForm.get('published')?.value ? 'Visible par tous les étudiants' : 'Seul vous pouvez le voir' }}</p>
              </div>

              <div class="border-top pt-3">
                <div class="d-flex gap-3 text-muted small mb-4">
                  <div><i class="bi bi-collection me-1"></i>{{ lessons.length }} leçon(s)</div>
                </div>
              </div>

              <div *ngIf="error" class="alert alert-danger py-2 small">{{ error }}</div>
              <div *ngIf="success" class="alert alert-success py-2 small"><i class="bi bi-check-circle me-1"></i>Cours créé avec succès !</div>

              <button type="submit" class="btn btn-primary-custom w-100" [disabled]="loading || courseForm.invalid">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i *ngIf="!loading" class="bi bi-save me-2"></i>
                {{ loading ? 'Création...' : 'Créer le cours' }}
              </button>
              <button type="button" class="btn btn-outline-secondary w-100 mt-2" (click)="finish(false)">Annuler</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `
})
export class CreateCourseComponent {
  readonly courseLevels = COURSE_LEVELS;
  categories = COURSE_CATEGORIES;
  loading = false;
  error = '';
  success = false;

  courseForm: FormGroup;

  get lessons() { return this.courseForm.get('lessons') as FormArray; }

  pendingUploads: PendingUpload[] = [];
  isDragOver = false;
  uploadingAll = false;


  /** Ouvert dans une popup (depuis une liste) ou comme page. */
  private readonly dialogRef = inject(DialogRef, { optional: true });
  private readonly dialogData = inject<{ id?: number } | null>(DIALOG_DATA, { optional: true });
  get inDialog(): boolean { return !!this.dialogRef; }

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private uploadService: UploadService,
    private router: Router,
    private dialogs: DialogService
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      level: ['L1', Validators.required],
      published: [false],
      lessons: this.fb.array([])
    });
  }

  addLesson(opts?: { title?: string; type?: string; videoUrl?: string; pdfUrl?: string }) {
    this.lessons.push(this.fb.group({
      title: [opts?.title || '', Validators.required],
      description: [''],
      type: [opts?.type || 'VIDEO'],
      videoUrl: [opts?.videoUrl || ''],
      pdfUrl: [opts?.pdfUrl || ''],
      duration: [0],
      orderIndex: [this.lessons.length]
    }));
  }

  removeLesson(i: number) { this.lessons.removeAt(i); }

  // ─── Import multiple fichiers ──────────────────────────────────────

  private detectKind(file: File): 'VIDEO' | 'PDF' | 'OTHER' {
    if (file.type.startsWith('video/')) return 'VIDEO';
    if (file.type === 'application/pdf' || /\.(pdf|doc|docx)$/i.test(file.name)) return 'PDF';
    return 'OTHER';
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
    input.value = '';
  }

  onDragOver(event: DragEvent) { event.preventDefault(); this.isDragOver = true; }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) this.addFiles(Array.from(event.dataTransfer.files));
  }

  private addFiles(files: File[]) {
    files.forEach(file => {
      this.pendingUploads.push({
        file,
        name: file.name,
        kind: this.detectKind(file),
        progress: 0,
        status: 'pending'
      });
    });
  }

  removePending(i: number) { this.pendingUploads.splice(i, 1); }

  hasPendingFiles() { return this.pendingUploads.some(u => u.status === 'pending' || u.status === 'error'); }
  pendingCount() { return this.pendingUploads.filter(u => u.status === 'pending' || u.status === 'error').length; }

  uploadAllPending() {
    const toUpload = this.pendingUploads.filter(u => u.status === 'pending' || u.status === 'error');
    if (!toUpload.length) return;
    this.uploadingAll = true;
    toUpload.forEach(u => u.status = 'uploading');

    this.uploadService.uploadBatch(toUpload.map(u => u.file)).subscribe({
      next: (res) => {
        const results: UploadedFile[] = res.data;
        toUpload.forEach((u, idx) => {
          const result = results[idx];
          if (result) {
            u.status = 'done';
            u.progress = 100;
            u.url = result.url;
            this.addLesson({
              title: this.stripExtension(u.name),
              type: result.type,
              videoUrl: result.type === 'VIDEO' ? result.url : '',
              pdfUrl: result.type === 'PDF' ? result.url : ''
            });
          } else {
            u.status = 'error';
            u.error = 'Échec de l\'import';
          }
        });
        this.uploadingAll = false;
      },
      error: (err) => {
        toUpload.forEach(u => { u.status = 'error'; u.error = err.error?.message || 'Erreur réseau'; });
        this.uploadingAll = false;
      }
    });
  }

  private stripExtension(filename: string): string {
    const dot = filename.lastIndexOf('.');
    return dot > 0 ? filename.substring(0, dot) : filename;
  }

  finish(saved: boolean) {
    if (saved) this.dialogs.toast('Cours créé');
    if (this.dialogRef) this.dialogRef.close(saved);
    else this.router.navigate(['/teacher/courses']);
  }

  onSubmit() {
    if (this.courseForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.courseService.createCourse(this.courseForm.value).subscribe({
      next: (course) => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.finish(true), this.dialogRef ? 0 : 1500);
      },
      error: (err) => { this.error = err.error?.message || 'Erreur lors de la création'; this.loading = false; }
    });
  }
}
