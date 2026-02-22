import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultFooterComponent } from './default-footer.component';

describe('DefaultFooterComponent', () => {
  let component: DefaultFooterComponent;
  let fixture: ComponentFixture<DefaultFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultFooterComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the names correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.names')?.textContent).toContain('NAKANY Andrianiaina Anthony & ANDRIAMBELO Onitsoa');
  });

  it('should display the copyright', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.copyright')?.textContent).toContain('Tous droits réservés');
  });
});