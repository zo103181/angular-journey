import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@NgModule()
export class IconsModule {
    /**
     * Constructor
     */
    constructor(
        private domSanitizer: DomSanitizer,
        private matIconRegistry: MatIconRegistry
    ) {
        // Register icon sets
        this.matIconRegistry.addSvgIconSetInNamespace('heroicons_outline', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg'));
        this.matIconRegistry.addSvgIconSetInNamespace('heroicons_solid', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-solid.svg'));
    }
}
