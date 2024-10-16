import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattypeGeneratorComponent } from './chattype-generator.component';

describe('ChattypeGeneratorComponent', () => {
  let component: ChattypeGeneratorComponent;
  let fixture: ComponentFixture<ChattypeGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChattypeGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChattypeGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
