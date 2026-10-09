import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { UploadService } from '../../../core/services/upload.service';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../../../core/models/course.model';
import { Course, Lesson } from '../../../core/models/course.model';
import { DialogService, DialogRef, DIALOG_DATA } from '../../../core/services/dialog.service';

const CODE_FILE_EXTENSIONS: Record<string, string> = {
  py: 'python', js: 'javascript', java: 'java', sql: 'sql', txt: 'python'
};

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="fade-in-up">
      <div *ngIf="!inDialog" class="d-flex align-items-center gap-3 mb-4">
        <a routerLink="/teacher/courses" class="btn btn-sm btn-outline-secondary"><i class="bi bi-arrow-left"></i></a>
        <h1 class="fw-bold mb-0"><i class="bi bi-pencil-square me-1"></i>Modifier le cours</h1>
      </div>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div *ngIf="!loading && courseForm" class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm p-4 mb-4" style="border-radius:16px">
            <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label fw-semibold">Titre</label>
                <input type="text" class="form-control" formControlName="title">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Description</label>
                <textarea class="form-control" rows="5" formControlName="description"></textarea>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label fw-semibold">Catégorie</label>
                  <select class="form-select" formControlName="category">
                    <option *ngFor="let cat of categories" [value]="cat.key">{{ cat.label }}</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label fw-semibold">Niveau</label>
                  <select class="form-select" formControlName="level">
                    <option *ngFor="let l of courseLevels" [value]="l.key">{{ l.label }}</option>
                  </select>
                </div>
              </div>
              <div class="form-check form-switch mb-4">
                <input type="checkbox" class="form-check-input" id="pub" formControlName="published" style="width:48px;height:24px">
                <label class="form-check-label fw-semibold ms-2" for="pub">
                  {{ courseForm.get('published')?.value ? 'Publié' : 'Brouillon' }}
                </label>
              </div>
              <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>
              <div *ngIf="success" class="alert alert-success py-2"><i class="bi bi-check-circle me-1"></i>Cours mis à jour !</div>
              <button type="submit" class="btn btn-primary-custom" [disabled]="saving">
                <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                Sauvegarder les modifications
              </button>
            </form>
          </div>

          <!-- Lessons / Exercises management -->
          <div class="card border-0 shadow-sm p-4" style="border-radius:16px">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold mb-0"><i class="bi bi-clipboard-check me-1"></i>Programme du cours</h5>
              <button class="btn btn-sm btn-primary-custom" (click)="startAddLesson()">
                <i class="bi bi-plus-lg me-1"></i>Ajouter un exercice / une leçon
              </button>
            </div>

            <div *ngIf="!lessons.length" class="text-muted text-center py-3">
              Aucune leçon ou exercice pour ce cours pour le moment.
            </div>

            <div *ngFor="let lesson of lessons; let i = index"
                 class="d-flex align-items-center gap-3 p-3 mb-2 border rounded-3">
              <div class="rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                   style="width:32px;height:32px">
                {{ i + 1 }}
              </div>
              <div class="flex-grow-1">
                <div class="fw-semibold">{{ lesson.title }}</div>
                <div class="text-muted small">
                  <i [class.bi-play-circle]="lesson.type === 'VIDEO'"
                     [class.bi-file-pdf]="lesson.type === 'PDF'"
                     [class.bi-code-slash]="lesson.type === 'CODE_EXERCISE'"
                     [class.bi-table]="lesson.type === 'EXCEL_EXERCISE'"
                     [class.bi-question-circle]="lesson.type === 'QUIZ'" class="me-1"></i>
                  {{ typeLabels[lesson.type] }}
                  <span *ngIf="lesson.duration"> · {{ lesson.duration }} min</span>
                  <span *ngIf="lesson.type === 'CODE_EXERCISE' && lesson.language"> · {{ lesson.language }}</span>
                </div>
              </div>
              <button class="btn btn-sm btn-outline-secondary" (click)="startEditLesson(lesson)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" (click)="deleteLesson(lesson)" [disabled]="deletingId === lesson.id">
                <span *ngIf="deletingId === lesson.id" class="spinner-border spinner-border-sm"></span>
                <i *ngIf="deletingId !== lesson.id" class="bi bi-trash"></i>
              </button>
            </div>

            <!-- Lesson form -->
            <div *ngIf="lessonForm" class="border rounded-3 p-3 mt-3 bg-light">
              <h6 class="fw-bold mb-3">{{ editingLessonId ? 'Modifier' : 'Nouveau' }} : exercice / leçon</h6>
              <form [formGroup]="lessonForm" (ngSubmit)="onSubmitLesson()">
                <div class="row g-3 mb-3">
                  <div class="col-8">
                    <label class="form-label fw-semibold">Titre</label>
                    <input type="text" class="form-control" formControlName="title" placeholder="Ex: Exercice - Boucles for">
                  </div>
                  <div class="col-4">
                    <label class="form-label fw-semibold">Type</label>
                    <select class="form-select" formControlName="type">
                      <option value="CODE_EXERCISE">Exercice de code</option>
                      <option value="EXCEL_EXERCISE">Exercice Excel</option>
                      <option value="VIDEO">Vidéo</option>
                      <option value="PDF">PDF</option>
                      <option value="QUIZ">Quiz</option>
                    </select>
                  </div>
                </div>

                <div class="form-check mb-3"
                     *ngIf="lessonForm.get('type')?.value !== 'CODE_EXERCISE' && lessonForm.get('type')?.value !== 'EXCEL_EXERCISE'">
                  <input type="checkbox" class="form-check-input" id="isExercise" formControlName="exercise">
                  <label class="form-check-label fw-semibold" for="isExercise">
                    <i class="bi bi-clipboard-data me-1"></i>Afficher dans l'onglet "Pratique" (exercice)
                  </label>
                  <div class="form-text">Cochez si ce contenu est un exercice à faire plutôt qu'un cours à lire.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    {{ lessonForm.get('type')?.value === 'CODE_EXERCISE' || lessonForm.get('type')?.value === 'EXCEL_EXERCISE' ? 'Énoncé de l\\'exercice' : 'Description' }}
                  </label>
                  <textarea class="form-control" rows="4" formControlName="description"
                            placeholder="Décrivez ce que l'élève doit faire..."></textarea>
                </div>

                <div class="mb-3" style="width:160px">
                  <label class="form-label fw-semibold">Durée (min)</label>
                  <input type="number" min="0" class="form-control" formControlName="duration">
                </div>

                <!-- CODE_EXERCISE specific fields -->
                <div *ngIf="lessonForm.get('type')?.value === 'CODE_EXERCISE'">
                  <div class="mb-3" style="width:220px">
                    <label class="form-label fw-semibold">Langage de l'IDE</label>
                    <select class="form-select" formControlName="language">
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="java">Java</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold"><i class="bi bi-file-earmark-text me-1"></i>Énoncé de l'exercice (PDF, optionnel)</label>
                    <div class="form-text mb-2">
                      Affiché à gauche de l'IDE, comme une feuille de TP. Si vide, la description ci-dessus est utilisée.
                    </div>
                    <div class="d-flex gap-2 align-items-center mb-2">
                      <input type="file" class="form-control" accept=".pdf,.doc,.docx"
                             (change)="onPdfFileSelected($event)" [disabled]="uploadingPdf">
                      <span *ngIf="uploadingPdf" class="spinner-border spinner-border-sm text-primary"></span>
                    </div>
                    <div *ngIf="lessonForm.get('pdfUrl')?.value" class="small text-success mb-2">
                      <i class="bi bi-check-circle me-1"></i>Énoncé prêt : {{ lessonForm.get('pdfUrl')?.value }}
                      <button type="button" class="btn btn-sm btn-link text-danger p-0 ms-2" (click)="lessonForm!.patchValue({pdfUrl:''})">Retirer</button>
                    </div>
                    <div *ngIf="pdfUploadError" class="small text-danger mb-2">{{ pdfUploadError }}</div>
                  </div>

                  <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <label class="form-label fw-semibold mb-0">Code de départ (affiché dans l'IDE)</label>
                      <label class="btn btn-sm btn-outline-secondary mb-0">
                        <i class="bi bi-upload me-1"></i>Importer un fichier de code
                        <input type="file" hidden accept=".py,.js,.java,.sql,.txt" (change)="onCodeFileSelected($event)">
                      </label>
                    </div>
                    <textarea class="form-control" rows="5" style="font-family:monospace; font-size:0.85rem"
                              formControlName="starterCode" placeholder="// Code de départ pour l'élève..."></textarea>
                  </div>
                </div>

                <!-- EXCEL_EXERCISE specific fields -->
                <div *ngIf="lessonForm.get('type')?.value === 'EXCEL_EXERCISE'" class="mb-3">
                  <label class="form-label fw-semibold">Feuille de départ (JSON, optionnel)</label>
                  <textarea class="form-control" rows="5" style="font-family:monospace; font-size:0.85rem"
                            formControlName="starterCode" placeholder='{"cells":{"A1":{"raw":"Désignation","bold":true}}}'></textarea>
                  <div class="form-text">
                    Pour pré-remplir le tableur : ouvrez <a routerLink="/spreadsheet" target="_blank">/spreadsheet</a>,
                    construisez votre modèle, cliquez sur "Exporter" puis collez le JSON ici. Laissez vide pour démarrer avec une feuille vierge.
                  </div>
                </div>

                <!-- VIDEO specific -->
                <div *ngIf="lessonForm.get('type')?.value === 'VIDEO'" class="mb-3">
                  <label class="form-label fw-semibold">URL de la vidéo</label>
                  <input type="text" class="form-control" formControlName="videoUrl" placeholder="https://...">
                </div>

                <!-- PDF specific -->
                <div *ngIf="lessonForm.get('type')?.value === 'PDF'" class="mb-3">
                  <label class="form-label fw-semibold">Document (PDF ou Word)</label>
                  <div class="d-flex gap-2 align-items-center mb-2">
                    <input type="file" class="form-control" accept=".pdf,.doc,.docx"
                           (change)="onPdfFileSelected($event)" [disabled]="uploadingPdf">
                    <span *ngIf="uploadingPdf" class="spinner-border spinner-border-sm text-primary"></span>
                  </div>
                  <div *ngIf="lessonForm.get('pdfUrl')?.value" class="small text-success mb-2">
                    <i class="bi bi-check-circle me-1"></i>Document prêt : {{ lessonForm.get('pdfUrl')?.value }}
                  </div>
                  <div *ngIf="pdfUploadError" class="small text-danger mb-2">{{ pdfUploadError }}</div>
                  <label class="form-label fw-semibold small text-muted">ou collez une URL directement</label>
                  <input type="text" class="form-control" formControlName="pdfUrl" placeholder="https://...">
                </div>

                <!-- Text content (shown to students as course material, e.g. when no video/PDF) -->
                <div *ngIf="lessonForm.get('type')?.value === 'VIDEO' || lessonForm.get('type')?.value === 'PDF'" class="mb-3">
                  <label class="form-label fw-semibold">Support de cours (texte affiché à l'élève)</label>
                  <textarea class="form-control" rows="6" formControlName="content"
                            placeholder="Rédigez ici le contenu pédagogique de la leçon (affiché si aucune vidéo/PDF n'est fourni)..."></textarea>
                </div>

                <div *ngIf="lessonError" class="alert alert-danger py-2">{{ lessonError }}</div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary-custom" [disabled]="savingLesson">
                    <span *ngIf="savingLesson" class="spinner-border spinner-border-sm me-2"></span>
                    {{ editingLessonId ? 'Enregistrer' : 'Ajouter' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary" (click)="cancelLessonForm()">Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EditCourseComponent implements OnInit {
  readonly courseLevels = COURSE_LEVELS;
  categories = COURSE_CATEGORIES;
  courseForm!: FormGroup;
  loading = true;
  saving = false;
  error = '';
  success = false;
  courseId!: number;

  course: Course | null = null;
  lessons: Lesson[] = [];

  lessonForm: FormGroup | null = null;
  editingLessonId: number | null = null;
  savingLesson = false;
  deletingId: number | null = null;
  lessonError = '';
  uploadingPdf = false;
  pdfUploadError = '';

  typeLabels: Record<string, string> = {
    VIDEO: 'Vidéo',
    PDF: 'PDF',
    QUIZ: 'Quiz',
    CODE_EXERCISE: 'Exercice de code',
    EXCEL_EXERCISE: 'Exercice Excel'
  };


  /** Ouvert dans une popup (depuis une liste) ou comme page. */
  private readonly dialogRef = inject(DialogRef, { optional: true });
  private readonly dialogData = inject<{ id?: number } | null>(DIALOG_DATA, { optional: true });
  get inDialog(): boolean { return !!this.dialogRef; }

  constructor(private dialogs: DialogService, 
    private fb: FormBuilder,
    private courseService: CourseService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.courseId = this.dialogData?.id ?? +this.route.snapshot.paramMap.get('id')!;
    this.courseService.getCourseById(this.courseId).subscribe(course => {
      this.course = course;
      this.lessons = (course.lessons || []).slice().sort((a, b) => a.orderIndex - b.orderIndex);
      this.courseForm = this.fb.group({
        title: [course.title, Validators.required],
        description: [course.description],
        category: [course.category],
        level: [course.level],
        published: [course.published]
      });
      this.loading = false;
    });
  }

  onSubmit() {
    this.saving = true;
    this.courseService.updateCourse(this.courseId, this.courseForm.value).subscribe({
      next: () => {
        this.saving = false; this.success = true;
        if (this.dialogRef) { this.dialogs.toast('Cours mis à jour'); this.dialogRef.close(true); }
        else setTimeout(() => this.router.navigate(['/teacher/courses']), 1500);
      },
      error: (err) => { this.error = err.error?.message || 'Erreur'; this.saving = false; }
    });
  }

  startAddLesson() {
    this.editingLessonId = null;
    this.lessonError = '';
    this.pdfUploadError = '';
    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      type: ['CODE_EXERCISE', Validators.required],
      description: [''],
      content: [''],
      duration: [0],
      language: ['python'],
      starterCode: [''],
      videoUrl: [''],
      pdfUrl: [''],
      exercise: [false]
    });
  }

  startEditLesson(lesson: Lesson) {
    this.editingLessonId = lesson.id;
    this.lessonError = '';
    this.pdfUploadError = '';
    this.lessonForm = this.fb.group({
      title: [lesson.title, Validators.required],
      type: [lesson.type, Validators.required],
      description: [lesson.description || ''],
      content: [lesson.content || ''],
      duration: [lesson.duration || 0],
      language: [lesson.language || 'python'],
      starterCode: [lesson.starterCode || ''],
      videoUrl: [lesson.videoUrl || ''],
      pdfUrl: [lesson.pdfUrl || ''],
      exercise: [lesson.exercise || false]
    });
  }

  cancelLessonForm() {
    this.lessonForm = null;
    this.editingLessonId = null;
    this.lessonError = '';
  }

  onSubmitLesson() {
    if (!this.lessonForm) return;
    this.savingLesson = true;
    this.lessonError = '';
    const value = this.lessonForm.value;

    if (this.editingLessonId) {
      this.courseService.updateLesson(this.editingLessonId, value).subscribe({
        next: (updated) => {
          const idx = this.lessons.findIndex(l => l.id === this.editingLessonId);
          if (idx >= 0) this.lessons[idx] = updated;
          this.savingLesson = false;
          this.cancelLessonForm();
        },
        error: (err) => { this.lessonError = err.error?.message || 'Erreur'; this.savingLesson = false; }
      });
    } else {
      this.courseService.createLesson(this.courseId, value).subscribe({
        next: (created) => {
          this.lessons.push(created);
          this.savingLesson = false;
          this.cancelLessonForm();
        },
        error: (err) => { this.lessonError = err.error?.message || 'Erreur'; this.savingLesson = false; }
      });
    }
  }

  onPdfFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.lessonForm) return;

    this.uploadingPdf = true;
    this.pdfUploadError = '';
    this.uploadService.uploadOne(file).subscribe({
      next: (res) => {
        this.lessonForm!.patchValue({ pdfUrl: res.data.url });
        this.uploadingPdf = false;
      },
      error: (err) => {
        this.pdfUploadError = err.error?.message || "Erreur lors de l'import du document";
        this.uploadingPdf = false;
      }
    });
    input.value = '';
  }

  onCodeFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.lessonForm) return;

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const reader = new FileReader();
    reader.onload = () => {
      const patch: Record<string, string> = { starterCode: String(reader.result || '') };
      if (CODE_FILE_EXTENSIONS[extension]) patch['language'] = CODE_FILE_EXTENSIONS[extension];
      this.lessonForm!.patchValue(patch);
    };
    reader.readAsText(file);
    input.value = '';
  }

  async deleteLesson(lesson: Lesson) {
    if (!(await this.dialogs.confirmDelete(`la leçon « ${lesson.title} »`))) return;
    this.deletingId = lesson.id;
    this.courseService.deleteLesson(lesson.id).subscribe({
      next: () => {
        this.lessons = this.lessons.filter(l => l.id !== lesson.id);
        this.deletingId = null;
      },
      error: () => { this.deletingId = null; }
    });
  }
}
