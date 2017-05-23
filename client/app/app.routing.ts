import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { Comparativa } from './components/comparativa.component';
import { Highstock } from './components/highstock.component';
import { Seguimiento } from './components/seguimiento.component';

const appRoutes: Routes = [
	{path:'', component: Comparativa},
	{path:'comparativa/:channel/:name', component: Comparativa},
	{path:'highstock/:channel/:idMonitor', component: Highstock},
	{path:'seguimiento', component: Seguimiento},
	{path:'**', component: Seguimiento}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);