import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { Comparativa } from './components/comparativa.component';
import { Informe } from './components/informe.component';
import { Highstock } from './components/highstock.component';
import { Seguimiento } from './components/seguimiento.component';

const appRoutes: Routes = [
	{path:'', component: Seguimiento},
	{path:'seguimiento', component: Seguimiento},
	{path:'comparativa/:channel/:name', component: Comparativa},
	{path:'informe/:channel/:name', component: Informe},
	{path:'highstock/:channel/:idMonitor', component: Highstock},
	{path:'**', component: Seguimiento}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);