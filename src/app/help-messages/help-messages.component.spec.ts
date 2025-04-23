import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMessagesComponent } from './help-messages.component';

describe('HelpMessagesComponent', () => {
  let component: HelpMessagesComponent;
  let fixture: ComponentFixture<HelpMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
