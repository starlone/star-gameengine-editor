import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogImportComponent } from './pages/edit/dialogs/dialog-import/dialog-import.component';
import { DialogNewrectComponent } from './pages/edit/dialogs/dialog-newrect/dialog-newrect.component';
import { EditComponent } from './pages/edit/edit.component';
import { PanelObjectsTreeComponent } from './pages/edit/panels/panel-objects-tree/panel-objects-tree.component';
import { PanelPropertiesComponent } from './pages/edit/panels/panel-properties/panel-properties.component';
import { ToolbarComponent } from './pages/edit/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogImportComponent,
    DialogNewrectComponent,
    EditComponent,
    PanelObjectsTreeComponent,
    PanelPropertiesComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    LayoutModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatTreeModule,
    DragDropModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
