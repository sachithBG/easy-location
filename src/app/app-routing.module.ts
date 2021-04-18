import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // {
  //   path: 'pm/1993',
  //   component: SideNavPmComponent,
  //   canActivate: [PmGuard],
  //   children: [
  //     { path: '', component: DashboardPmComponent },
  //   ],
  // },
  // { path: '**', component: Er404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],//.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
