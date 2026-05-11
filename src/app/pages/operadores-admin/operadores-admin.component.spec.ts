import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadoresAdminComponent } from './operadores-admin.component';

describe('OperadoresAdminComponent', () => {
  let component: OperadoresAdminComponent;
  let fixture: ComponentFixture<OperadoresAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperadoresAdminComponent]
    });
    fixture = TestBed.createComponent(OperadoresAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
