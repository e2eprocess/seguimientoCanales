import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { Comparativa } from './components/comparativa.component';
import { Highstock } from './components/highstock.component';

const appRoutes: Routes = [
	{path:'', component: Comparativa},
	{path:'comparativa/:channel/:name', component: Comparativa},
	{path:'highstock/:channel', component: Highstock},
	{path:'**', component: Comparativa}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);