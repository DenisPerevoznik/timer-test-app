import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, interval } from 'rxjs';
import { buffer, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit {
  constructor() {}
  timer: any;
  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;
  @ViewChild('waitBtn', { static: true }) waitBtn: ElementRef;
  buttonSubscription;
  isEnable: boolean = false;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.buttonSubscription = fromEvent(this.waitBtn.nativeElement, 'click')
      .pipe(
        buffer(interval(300)),
        filter((clicks) => clicks.length === 2)
      )
      .subscribe(() => {
        this.timer.unsubscribe();
        this.isEnable = false;
      });
  }

  ngOnDestroy() {
    this.buttonSubscription.unsubscribe();
    this.timer.unsubscribe();
  }

  handleStart() {
    this.isEnable = true;
    this.timer = interval(1000)
      .pipe(
        map(() => {
          this.seconds++;
        })
      )
      .subscribe(() => {
        if (this.seconds === 60) {
          this.minutes++;
          this.seconds = 0;
        }

        if (this.minutes === 60) {
          this.hours++;
          this.minutes = 0;
        }
      });
  }

  handleStop() {
    if (this.timer) {
      this.timer.unsubscribe();
      this.nullify();
      this.isEnable = false;
    }
  }

  nullify() {
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }

  handleReset() {
    this.timer.unsubscribe();
    this.nullify();
    this.handleStart();
  }
}
