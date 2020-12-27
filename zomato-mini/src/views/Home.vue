<template>
    <v-container fluid>
        <v-layout justify-center align-center column pa-5 class="home">
            <div class="display-4 font-weight-black white--text text-xs-center">
                Zomato Mini
            </div>
            <div
                class="display-1 font-weight-black white--text text-xs-center mb-3"
            >
                Discover the best food & drinks
            </div>

            <v-col class="d-flex" white--text cols="12" sm="6">
                <v-text-field
                    hide-details
                    v-model="city_name"
                    filled
                    label="City"
                    @input="getCityDetails"
                    prepend-inner-icon="mdi-map-marker"
                ></v-text-field>
            </v-col>
            <v-row>
                <v-col class="select" md="6" sm="6">
                    <v-select
                        :items="cuisines"
                        v-model="cuisine_selected"
                        label="Select Cuisines"
                        item-text="cuisine.cuisine_name"
                        item-value="cuisine.cuisine_id"
                        multiple
                    ></v-select>
                </v-col>

                <v-col class="select" md="6" sm="6">
                    <v-select
                        :items="restaurant_types"
                        v-model="restaurant_type_selected"
                        label="Select Restaurant Type"
                        item-text="establishment.name"
                        item-value="establishment.id"
                    ></v-select>
                </v-col>
            </v-row>
            <v-col class="d-flex" cols="12" sm="6">
                <v-text-field
                    v-model="search_text"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    v-on:keyup.enter="handleEnter"
                ></v-text-field>
            </v-col>
        </v-layout>

        <List ref="list"></List>
    </v-container>
</template>

<script>
import { HTTP } from '../http-constants';
import List from './List.vue';

export default {
    name: 'Home',
    components: {
        List
    },
    data() {
        return {
            cuisines: [],
            restaurant_types: [],
            cuisine_selected: [],
            restaurant_type_selected: [],
            search_results: [],
            search_text: '',
            city_name: '',
            city: { id: 0, name: '' },
            errors: ''
        };
    },
    methods: {
        getCityDetails: function() {
            HTTP.get(`/cities?q=${this.city_name}`)
                .then(response => {
                    if (response.data.location_suggestions.length > 0) {
                        this.city.id = response.data.location_suggestions[0].id;
                        this.city.name =
                            response.data.location_suggestions[0].name;
                        this.getCuisines();
                        this.getRestaurantTypes();
                    }
                })
                .catch(e => {
                    this.errors = e;
                });
        },
        getCuisines: function() {
            HTTP.get(`/cuisines?city_id=${this.city.id}`)
                .then(response => {
                    this.cuisines = response.data.cuisines;
                })
                .catch(e => {
                    this.errors = e;
                });
        },

        getRestaurantTypes: function() {
            HTTP.get(`/establishments?city_id=${this.city.id}`)
                .then(response => {
                    this.restaurant_types = response.data.establishments;
                })
                .catch(e => {
                    this.errors = e;
                });
        },
        handleEnter: function() {
            if (
                this.cuisine_selected.length == 0 &&
                this.restaurant_type_selected.length == 0
            ) {
                alert('please select atleast cuisine or restaurant type');
                return false;
            }
            this.$refs.list.search(
                this.search_text,
                this.cuisine_selected,
                this.restaurant_type_selected
            );
        }
    }
};
</script>

<style scoped src="../styles/styles.css"></style>
