import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattypeListComponent } from './chattype-list.component';

describe('ChattypeListComponent', () => {
  let component: ChattypeListComponent;
  let fixture: ComponentFixture<ChattypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChattypeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChattypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
