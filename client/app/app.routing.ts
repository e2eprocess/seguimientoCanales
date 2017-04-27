import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { Comparativa } from './components/comparativa.component'

const appRoutes: Routes = [
	{path:'', component: Comparativa},
	{path:'comparativa/:canal/:name', component: Comparativa},
	{path:'**', component: Comparativa}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);