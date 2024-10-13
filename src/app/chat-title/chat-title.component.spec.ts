import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTitleComponent } from './chat-title.component';

describe('ChatTitleComponent', () => {
  let component: ChatTitleComponent;
  let fixture: ComponentFixture<ChatTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
