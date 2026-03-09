import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render bottom nav', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const nav = fixture.nativeElement.querySelector('nav.bottom-nav');
    expect(nav).toBeTruthy();
  });

  it('should have 4 nav links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = fixture.nativeElement.querySelectorAll('nav a');
    expect(links).toHaveLength(4);
  });
});
