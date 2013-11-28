/*

 Navbar: This module wraps the navbar control at the top of the page.

 Use cases this module has to handle:
 - User clicks navbar: change the "active" state of the clicked navbar button.
 - User refreshes page: make sure correct navbar button is
 selected for the page.)
 - User navigates to a new page w/o clicking the navbar (eg, click search results,
 links to landing page in Assets section -- change navbar to Assets): change
 the navbar to reflect correct section for the new page.

 */

OCI.module("Navbar", function(Navbar, App, Backbone, Marionette, $, _, log){
    "use strict";

    // Vars used as symbolic constants by other pages to declare their corresponding navbar section
    Navbar.ADMIN = 'Admin';
    Navbar.ASSETS = 'Assets';
    Navbar.OPERATIONS = 'Operations';
    Navbar.PLANNING = 'Planning';


    // Respond to page_changed event to see if we need to switch to new
    // toolbar section. Eg, if user reloads page beneath Operations section,
    // we need to enable Operations navbar item.
    App.vent.on('page_changed', function(pageName){
        Navbar.controller.onNewPage(pageName);
    });

    // Initializer & Finalizer
    // -----------------------

    Navbar.addInitializer(function(){
        Navbar.controller = new Navbar.Controller();
        Navbar.controller.start();
    });

    Navbar.addFinalizer(function(){
        delete Navbar.controller;
    });


    // navbar View
    //
    // Note that we don't render -- just used for code organization, and to conveniently bind
    // event listeners declaratively. The controller gives view ctor the already-existing
    // element to use for the view.
    // ------------------------------
    //
    Navbar.View = Marionette.ItemView.extend({
        ui: { // marionette binds these elements to e.g. this.ui.operations
            operations: '#nav-operations',
            assets: '#nav-assets',
            planning: '#nav-planning',
            admin: '#nav-admin'
        },

        events: {
            'click #nav-operations': 'onOperations',
            'click #nav-assets': 'onAssets',
            'click #nav-planning': 'onPlanning',
            'click #nav-admin': 'onAdmin',
        },

        // custom render: don't really render, since this view just attaches to existing navbar html.
        // Instead just wire up "ui" hash, and force Operations to be selected tab.
        render: function() {
            this.bindUIElements();
        },

        changeToSection: function(sectionid) {
            if (sectionid === Navbar.ADMIN) { this.ui.admin.click(); }
            else if (sectionid === Navbar.ASSETS) { this.ui.assets.click(); }
            else if (sectionid === Navbar.OPERATIONS) { this.ui.operations.click(); }
            else if (sectionid === Navbar.PLANNING) { this.ui.planning.click(); }
            else {
                log.error('Navbar view changeToSection called with invalid id: ' + sectionid);
            }
        },

        onOperations: function(e) {
            this.makeActiveSelection(this.ui.operations);
            this.trigger('activeSection', Navbar.OPERATIONS);
        },

        onAssets: function(e) {
            this.makeActiveSelection(this.ui.assets);
            this.trigger('activeSection', Navbar.ASSETS);
        },

        onPlanning: function(e) {
            this.makeActiveSelection(this.ui.planning);
            this.trigger('activeSection', Navbar.PLANNING);
        },

        onAdmin: function(e) {
            this.makeActiveSelection(this.ui.admin);
            this.trigger('activeSection', Navbar.ADMIN);
        },

        makeActiveSelection: function(target) {
            if (this.currSelected) {
                this.currSelected.removeClass('active');
            }
            target.addClass('active');
            this.currSelected = target;
        }

    });


    // navbar Controller
    // ------------------------------
    //

    Navbar.Controller = Marionette.Controller.extend({
        start: function(){
            //log.debug('Navbar.Controller.start');
            this.view = new Navbar.View({el: $('#navbar')});
            this.view.render();
            this.listenTo(this.view, 'activeSection', this.onSectionChanged);
        },

        close: function(e){
            this.view.close();
        },

        onNewPage: function(pageName) {
            var section = this.sectionForPage(pageName);
            if (!this.isCurrentSection(section)) {
                this.changeToSection(section);
            }
        },

        sectionForPage: function(pageName) {
            var section;

            // if page declares its section ("Mypage.navbarSection = Navbar.ADMIN;") then use that
            if (App[pageName] && typeof App[pageName]['navbarSection'] !== 'undefined') {
                section = App[pageName][navbarSection];
            }

            // else recognize main page of each section
            else if (pageName === 'Page.Admin')
                section = Navbar.ADMIN;
            else if (pageName === 'Page.Assets')
                section = Navbar.ASSETS;
            else if (pageName === 'Page.Operations')
                section = Navbar.OPERATIONS;
            else if (pageName === 'Page.Planning')
                section = Navbar.PLANNING;

            // Still no section? Default to Admin.
            if (!section)
                section = Navbar.ADMIN;

            //log.debug('Navbar.sectionForPage "' + pageName + '" = ' + section);
            return section;
        },

        isCurrentSection: function(section) {
            return (section === this.currentSection);
        },

        changeToSection: function(section) {
            //log.debug('navbar changeToSection ' + section);
            this.view.changeToSection(section);
        },

        // Called when view fires event indicating that navbar section changed.
        // newSection = Navbar.ADMIN, etc.
        onSectionChanged: function(newSection) {
            //log.debug('onSectionChanged: ' + newSection);
            this.currentSection = newSection;
        }
    });


});


