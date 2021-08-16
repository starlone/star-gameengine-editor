import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Bodies, Engine, Render, World, Runner } from 'matter-js';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'star-gameengine-editor';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit() {
    this.demo();
  }

  demo() {
    var runner = Runner.create();
    var engine = Engine.create()
    var render = Render.create({
      element: document.getElementById('canvas') || undefined,
      engine: engine,
      options: {
        width: 800,
        height: 400,
        wireframes: false,
      },
    })
    var boxA = Bodies.rectangle(400, 200, 80, 80)
    var ballA = Bodies.circle(380, 100, 40, {})
    var ballB = Bodies.circle(460, 10, 40, {})
    var ground = Bodies.rectangle(400, 380, 810, 60, {
      isStatic: true,
    })
    World.add(engine.world, [boxA, ballA, ballB, ground])
    Render.run(render)

    Runner.run(runner, engine);
    console.log('oi');

  }
}
