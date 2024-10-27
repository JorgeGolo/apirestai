import { TestBed } from '@angular/core/testing';

import { ChatgptmiapiService } from './chatgptmiapi.service';

describe('ChatgptmiapiService', () => {
  let service: ChatgptmiapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatgptmiapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
