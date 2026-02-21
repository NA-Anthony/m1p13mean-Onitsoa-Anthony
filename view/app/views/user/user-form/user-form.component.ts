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
      role: ['acheteur', Validators.required],
      photo: [''],
      actif: [true]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId && this.userId !== 'nouveau';

    if (this.isEditMode && this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        if (user) {
          this.userForm.patchValue({
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            photo: user.photo,
            actif: user.actif
          });
        }
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

    const userData = this.userForm.value;

    if (this.isEditMode && this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe({
        next: () => this.router.navigate(['/users'])
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => this.router.navigate(['/users'])
      });
    }
  }
}