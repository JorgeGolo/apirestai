import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatResponsesComponent } from './chat-responses.component';

describe('ChatResponsesComponent', () => {
  let component: ChatResponsesComponent;
  let fixture: ComponentFixture<ChatResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatResponsesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
