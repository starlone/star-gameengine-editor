import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Factory, KeyboardHandler, PlataformPlayerScript, StarEngine } from 'star-gameengine';

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

  scene: any;

  constructor(private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit() {
    this.inicialContent();
  }

  inicialContent() {
    const se = new StarEngine("canvas");

    this.scene = se.getScene();

    var terrain = Factory.rect({
      'name': 'terrain', 'x': 500, 'y': 500, 'w': 800, 'h': 30, static: true
    });
    this.scene.add(terrain);

    var ghost = Factory.rect({
      'name': 'ghost', 'x': 500, 'y': 300, 'w': 800, 'h': 30, static: true, hasRigidBody: false
    });
    this.scene.add(ghost);

    var player = Factory.rect({
      'name': 'obj1', 'x': 300, 'y': 30, 'w': 30, 'h': 30, 'color': 'green'
    });
    this.scene.add(player);
    var script = new PlataformPlayerScript(player, se.getJoystick(), 1);
    player.addScript(script);

    const handler = new KeyboardHandler(se.getJoystick());
    console.log(handler);

    se.start();
  }

}
