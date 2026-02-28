import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { 
  CardModule, GridModule, ButtonModule, FormModule, 
  AvatarModule, SpinnerModule, AlertModule, BadgeModule,
  ProgressModule
} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { 
  cilHistory, 
  cilCamera, 
  cilSettings, 
  cilWallet, 
  cilBank, 
  cilCheckCircle, 
  cilXCircle,
  cilSave,
  cilTrash
} from '@coreui/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, GridModule, 
    ButtonModule, FormModule, AvatarModule, IconModule,
    SpinnerModule, AlertModule, BadgeModule, ProgressModule
    ],
  providers: [IconSetService]
})
export class ProfilComponent implements OnInit {
  userData: any = null;
  profilData: any = {
    telephone: '',
    adresseLivraisonParDefaut: {
      rue: '',
      codePostal: '',
      ville: '',
      pays: 'France'
    }
  };
  
  // États de chargement
  loading = true;
  submitting = false;
  uploadLoading = false;
  uploadProgress = 0;
  message: { type: string, text: string } | null = null;
  
  // Pour l'upload de photo
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private iconSetService: IconSetService
  ) {
      this.iconSetService.icons = {
      cilHistory,
      cilCamera,
      cilSettings,
      cilWallet,
      cilBank,
      cilCheckCircle,
      cilXCircle,
      cilSave,
      cilTrash
    };
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.authService.getMe().subscribe({
      next: (res) => {
        this.userData = { ...res.user };
        
        // Initialiser profilData avec les valeurs existantes ou par défaut
        this.profilData = { 
          ...res.profil,
          adresseLivraisonParDefaut: res.profil?.adresseLivraisonParDefaut || {
            rue: '',
            codePostal: '',
            ville: '',
            pays: 'France'
          }
        };
        
        // Prévisualisation de la photo existante (URL du serveur)
        if (res.user?.photo) {
          this.imagePreview = this.getFullImageUrl(res.user.photo);
        }
        
        this.loading = false;
      },
      error: (err) => {
        this.message = { type: 'danger', text: 'Erreur de chargement du profil' };
        this.loading = false;
        console.error(err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validation
      if (!file.type.startsWith('image/')) {
        this.message = { type: 'danger', text: 'Veuillez sélectionner une image valide' };
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        this.message = { type: 'danger', text: 'L\'image ne doit pas dépasser 2MB' };
        return;
      }

      this.selectedFile = file;
      this.message = null;

      // Créer la prévisualisation
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    if (this.userData) {
      this.userData.photo = '';
    }
    // Réinitialiser l'input file
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(this.userData?.photo || '');
        return;
      }

      this.uploadLoading = true;
      this.uploadProgress = 0;
      
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      
      this.http.post('https://m1p13mean-onitsoa-anthony.onrender.com/api/upload', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event: any) => {
          if (event.type === 1) { // UploadProgress
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === 4) { // Response
            this.uploadLoading = false;
            resolve(event.body.imageUrl || event.body.url || '');
          }
        },
        error: (err) => {
          this.uploadLoading = false;
          this.message = { type: 'danger', text: 'Erreur lors de l\'upload de l\'image' };
          reject(err);
        }
      });
    });
  }

  getFullImageUrl(url: string | null): string {
    if (!url) return '';
    
    // Si c'est une dataURL (Base64) - retourner directement
    if (url.startsWith('data:image')) {
      return url;
    }
    
    // Si c'est déjà une URL complète
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Chemin relatif - ajouter le domaine du backend
    return 'https://m1p13mean-onitsoa-anthony.onrender.com' + url;
  }

  async onSubmit(): Promise<void> {
    // Validation simple
    if (!this.userData.prenom || !this.userData.nom) {
      this.message = { type: 'danger', text: 'Le prénom et le nom sont requis' };
      return;
    }

    this.submitting = true;
    this.message = null;

    try {
      // Upload de l'image si nécessaire
      let photoUrl = this.userData.photo;
      if (this.selectedFile) {
        photoUrl = await this.uploadImage();
      }

      const payload: any = {
        nom: this.userData.nom,
        prenom: this.userData.prenom,
        telephone: this.profilData.telephone,
        photo: photoUrl
      };

      // Ajouter les champs spécifiques selon le rôle
      if (this.userData.role === 'boutique') {
        payload.nomBoutique = this.profilData.nomBoutique;
      } else if (this.userData.role === 'acheteur') {
        payload.adresse = {
          rue: this.profilData.adresseLivraisonParDefaut.rue,
          codePostal: this.profilData.adresseLivraisonParDefaut.codePostal,
          ville: this.profilData.adresseLivraisonParDefaut.ville,
          pays: this.profilData.adresseLivraisonParDefaut.pays
        };
      }

      this.authService.updateProfil(payload).subscribe({
        next: (res) => {
          this.message = { type: 'success', text: 'Profil mis à jour avec succès !' };
          this.submitting = false;
          this.selectedFile = null;
          
          // Mettre à jour les données avec la réponse du serveur
          if (res.user) {
            this.userData = { ...this.userData, ...res.user };
            // Mettre à jour l'aperçu avec la nouvelle URL du serveur
            if (res.user.photo) {
              this.imagePreview = this.getFullImageUrl(res.user.photo);
            }
          }
        },
        error: (err) => {
          this.message = { type: 'danger', text: err.error?.msg || 'Échec de la mise à jour' };
          this.submitting = false;
          console.error(err);
        }
      });
    } catch (error) {
      this.message = { type: 'danger', text: 'Erreur lors de la mise à jour' };
      this.submitting = false;
    }
  }
}