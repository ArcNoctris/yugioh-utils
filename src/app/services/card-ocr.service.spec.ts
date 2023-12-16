import { TestBed } from '@angular/core/testing';

import { CardOcrService } from './card-ocr.service';

describe('CardOcrService', () => {
  let service: CardOcrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardOcrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
