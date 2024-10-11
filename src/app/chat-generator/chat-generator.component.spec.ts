import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGeneratorComponent } from './chat-generator.component';

describe('ChatGeneratorComponent', () => {
  let component: ChatGeneratorComponent;
  let fixture: ComponentFixture<ChatGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
