import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CardModule,
  FormModule,
  GridModule,
  ButtonModule,
  ProgressModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { UserService } from '../user.service';
import { ROLES } from '../user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    ProgressModule,
    IconModule
  ]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  roles = ROLES;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['acheteur', Validators.required],
      photo: [''],
      actif: [true]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId && this.userId !== 'nouveau';

    // En mode édition, le mot de passe n'est pas obligatoire
    if (this.isEditMode) {
      this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }

    if (this.isEditMode && this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(id: string): void {
    console.log('📥 Chargement de l\'utilisateur:', id);
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        
        // Gérer la structure { user, profile } retournée par le backend
        const user = response.user || response;
        
        if (user) {
          this.userForm.patchValue({
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            photo: user.photo || '',
            actif: user.actif !== undefined ? user.actif : true
          });
        } else {
          this.errorMessage = 'Impossible de charger les données de l\'utilisateur';
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.msg || 'Erreur lors du chargement des données';
      }
    });
  }

  getProgressValue(): number {
    let progress = 0;
    if (this.userForm.get('nom')?.valid) progress += 20;
    if (this.userForm.get('prenom')?.valid) progress += 20;
    if (this.userForm.get('email')?.valid) progress += 30;
    if (this.userForm.get('role')?.valid) progress += 20;
    if (this.userForm.get('photo')?.value) progress += 10;
    return progress;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const userData = this.userForm.value;

    if (this.isEditMode && this.userId) {
      // Pour l'édition, ne pas envoyer le password s'il est vide
      if (!userData.password) {
        delete userData.password;
      }
      this.userService.updateUser(this.userId, userData).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.errorMessage = error.error?.msg || 'Erreur lors de la modification';
          this.isSubmitting = false;
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.errorMessage = error.error?.msg || 'Erreur lors de la création';
          this.isSubmitting = false;
        }
      });
    }
  }
}