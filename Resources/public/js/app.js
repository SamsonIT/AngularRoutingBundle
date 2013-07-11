angular.module('Samson.Routing', ['ui.state'])
    .config(function($locationProvider, $stateProvider, $routeProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    var addState = function(name, routeName, url) {
        $stateProvider.state(name, {
            url: url,
            templateProvider: function($state, $stateParams, $http, $q) {
                var deferred = $q.defer();
                $http.get(Routing.generate(routeName, $stateParams)).success(function(data, status, headers) {
                    deferred.resolve(data);
                }).error(function(data) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            }
        })
    }

    var routes = ["samson_nitro_address_book_homepage", "company_financial_price_agreements", "index", "labour_my_overview", "labour_quick_insert", "labour_new", "labour_updatestart", "labour_modify", "labour_updateduration", "labour_entries", "labour_overview", "labour_change_time", "labour_create", "labour_invoice", "mantis_issue", "mantis_issues", "project_product_create", "project_product_create_step_2", "project_product_edit", "project_product_delete", "product_history", "product_definition", "product_definition_create", "product_definition_edit", "product_definition_create_child", "product_definition_delete_child", "product_definition_delete", "product_definition_group", "project_create", "project_company_list", "project", "project_quick_search", "project_show", "project_delete", "project_hours", "project_products_and_services", "project_realisation", "project_services", "project_invoice", "project_invoice_preview", "project_pending_invoices", "project_prod_serv_template", "project_prod_serv_template_apply", "project_wdf_select", "project_price_agreements", "project_company_edit", "project_history", "project_status", "project_type", "rate", "project_service_create", "project_service_create_step_2", "project_service_edit", "project_service_delete", "service_history", "unit", "vehicle", "vehicle_details", "vehicle_create", "vehicle_edit", "vehicle_remove", "youtrack_issue", "youtrack_issues", "login", "login_check", "logout", "reset_password", "change_user_autocomplete", "security_manage_actions", "security_manage_actions_change", "security_usergroup", "security_usergroup_new", "security_usergroup_edit", "security_usergroup_delete", "security_user_preferences", "company_contacts", "company_contact_add", "company", "company_quick_search", "company_new", "company_edit", "company_delete", "company_addresses", "company_address_calculate", "country", "country_state", "company_import", "person", "person_quick_search", "person_new", "person_edit", "person_delete", "person_undelete", "person_create_user", "person_delete_user", "person_edit_user", "person_qualifications", "person_history", "qualification_types", "company_financial", "company_financial_av_status", "company_financial_invoice_method_new", "company_financial_invoice_method_edit", "company_financial_invoice_method_delete", "financial_status", "invoice", "invoice_show", "invoice_delete", "invoice_avapi", "invoice_wdf_select", "invoice_definitive", "invoice_save_doc", "invoice_download_doc", "invoice_line_create", "invoice_line_delete", "invoice_line_edit", "invoice_lines_sort", "invoice_edit_settings", "payment_terms", "payment_terms_av_list", "vat", "vat_av_list", "note_show", "note_create", "note_add", "note_edit", "note_delete", "note_list", "filter_savePreset", "filter_managePresets", "samson_framework_form_xml_edit_preview", "wdf_templates_configuration", "wdf_template_configuration", "wdf_template_select", "wdf_template_download", "printer_zebra", "printer_zebra_edit", "printer_zebra_delete", "printer_zebra_create", "printer_zebra_test", "printer_zebra_label", "calendar", "calendar_new", "calendar_edit", "labour", "labour_edit", "labour_delete", "labour_registrar_turn_in", "labour_registrar_register_multiple", "labour_registrar_undo_turn_in", "labour_turn_in_all", "labour_turn_in_all_submit", "labour_payroll", "labour_close", "labour_turn_in_preview", "labour_type_collection", "labour_type_collection_new", "labour_type_collection_edit", "labour_type_collection_delete", "labour_type_collection_labour_types", "labour_type", "labour_type_new", "labour_type_edit", "labour_type_delete", "labour_type_mutation_rule", "mutations", "registrar_mutations", "mutation_add", "mutation_levelerzero", "mutation_rules", "mutation_rule_new", "mutation_rule_edit", "mutation_rule_delete", "period", "period_new", "piecework_item", "piecework_item_new", "piecework_item_edit", "piecework_item_delete", "registrar", "registrar_new", "registrar_edit", "registrar_balance", "turn_in_processor_rules", "turn_in_processor_rule_new", "turn_in_processor_rule_edit", "turn_in_processor_rule_delete", "contract_edit", "contract_new", "registrar_contracts", "contract_delete", "contract_updatehours", "contract_history", "task_index", "task_complete", "task_delay", "task_edit", "task_add", "task_overview", "task_delete", "task_entity_detailed_list", "knockoutTaskList", "samson_planning_capacitydefinition", "samson_planning_capacitydefinition_details", "samson_planning_capacitydefinition_create", "samson_planning_capacitydefinition_edit", "samson_planning_capacitydefinition_remove", "samson_planning_capacity", "samson_planning_capacity_all", "samson_planning_capacity_create", "samson_planning_capacity_edit", "samson_planning_capacity_remove", "samson_planning_availability", "samson_planning_availability_viewDay", "samson_planning_availability_viewWeek", "samson_planning_availability_viewMonth", "samson_planning_availability_edit", "samson_planning_availability_make_default", "homepage"];
    for (var i in routes) {
        var routeName = routes[i]
        var route = Routing.getRoute(routeName);
        var urls = [];
        var url = '';
        for (var j = route.tokens.length - 1; j >= 0; j--) {
            var token = route.tokens[j];
            if (token[0] == 'text') {
                url += token[1];
            } else if (token[0] == 'variable') {
                if (token[3] == '_format') {
                    urls.push(url);
                    url += token[1]+'html';
                } else if (token[3] in route.requirements) {
                    url += token[1]+"{"+token[3]+":"+route.requirements[token[3]]+"}";
                } else {
                    if (j == 0) {
                        urls.push(url);
                    }
                    url += token[1]+"{"+token[3]+"}";
                }
            } else {
                alert('fout');
            }
        }
        urls.push(url);
        for (var j in urls) {
            addState(routeName+"-"+j, routeName, urls[j]);
        }
    }

    $stateProvider.state('fallback', {
        url: '/{path:.*}',
        controller: function($scope, $location) {
            window.location.href = $location.path();
        }
    })
})
;

angular.module('Samson.Routing').controller('MainCtrl', function($scope, $state, $document) {
    var initialCall = true;

    $scope.loading = false;

    $scope.$on('$stateChangeStart', function(e) {
        if (initialCall) {
            initialCall = false;
            e.preventDefault();
            return;
        }

        $scope.loading = true;
    })
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loading = false;
        setTimeout(function() {
            $document.get(0).title = $document.find('h1').text();
        }, 0);
    })
});
angular.module('Samson.Routing').directive('form', function() {
    return {
        name: 'formHandler',
        restrict: 'E',
        scope: true,
        link: function($scope, iElement, iAttr) {
            if (!iAttr.action) {
                return;
            }
            iElement.on('submit', function(e) {
                e.preventDefault();
                $scope.$apply(function() {
                    $scope.$emit('$stateChangeStart');
                    $scope.submit(iElement).then(function(template) {
                        $scope.$emit('$stateChangeSuccess');
                        iElement.parents('[ui-view]').last().empty().append(template);
                    }, function(template) {
                        $scope.$emit('$stateChangeSuccess');
                        iElement.parents('[ui-view]').last().empty().append(template);
                    });
                });
            })
        },
        controller: function($scope, $state, $http, $q, $location, $compile) {
            $scope.submit = function($form) {
                var deferred = $q.defer();
                $http[$form.get(0).method]($form.attr('action'), $form.serialize(), { headers: { 'Content-Type': $form.get(0).enctype } }).success(function(data, xhr, headers) {
                    var template = angular.element(data);
                    var linkFn = $compile(template);
                    linkFn($scope);
                    deferred.resolve(template);
                }).error(function(data, xhr) {
                    var template = angular.element(data);
                    var linkFn = $compile(template);
                    linkFn($scope);
                    deferred.reject(template);
                });
                return deferred.promise;
            }
        }
    }
});