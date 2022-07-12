import { TestBed } from '@angular/core/testing';

import { FirebaseCommunicationService } from './firebase-communication.service';

describe('FirebaseCommunicationService', () => {
  let service: FirebaseCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
