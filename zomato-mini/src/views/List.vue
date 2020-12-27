<template>
    <v-container>
        <template>
            <v-flex d-flex>
                <v-layout wrap>
                    <v-flex
                        md3
                        class="item"
                        v-for="item in this.search_results"
                        :key="item.id"
                    >
                        <img
                            :src="
                                item.restaurant.thumb
                                    ? item.restaurant.thumb
                                    : 'https://b.zmtcdn.com/images/res_avatar_476_320_1x_new.png'
                            "
                            width="200px"
                            height="200px"
                        />
                        <div class="title">{{ item.restaurant.name }}</div>
                        <div>
                            ₹ {{ item.restaurant.average_cost_for_two }} For Two
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>

            <template>
                <div class="text-center" v-if="this.totalpageslength > 0">
                    <v-pagination
                        v-model="page"
                        :length="this.totalpageslength"
                        :total-visible="10"
                        @input="handlePageChange"
                    ></v-pagination>
                </div>
                <div class="text-center" v-if="this.showMsg">
                    <h1>Nothing Found</h1>
                    <p>
                        Sorry, but nothing matched your search of
                        <strong>[keywords]</strong>. <br />
                        Please try again with some different keywords.
                    </p>
                </div>
            </template>
        </template>
    </v-container>
</template>

<script>
import { HTTP } from '../http-constants';

export default {
    name: 'List',
    props: {
        msg: String
    },
    data() {
        return {
            search_results: [],
            showMsg: false,
            page: 1,
            offset: 0,
            perPage: 12,
            totalpageslength: 0,
            text: '',
            cuisine_id: 0,
            restaurant_type_id: 0
        };
    },
    methods: {
        handlePageChange(value) {
            this.page = value;
            this.offset = (value - 1) * this.perPage;
            this.getRestaturants();
        },

        search: function(text, cuisine_id, restaurant_type_id) {
            this.text = text;
            this.cuisine_id = cuisine_id;
            this.restaurant_type_id = restaurant_type_id;
            this.totalpageslength = 0;
            this.offset = 0;
            this.page = 1;
            this.getRestaturants();
        },
        getRestaturants() {
            HTTP.get(
                `/search?q=${this.text}&start=${this.offset}&count=${this.perPage}&cuisines=${this.cuisine_id}&establishment_type=${this.restaurant_type_id}`
            )
                .then(response => {
                    this.showMsg = false;
                    this.search_results = response.data.restaurants;
                    if (response.data.results_found == 0) {
                        this.showMsg = true;
                    }
                    this.totalpageslength = Math.ceil(
                        response.data.results_found / this.perPage
                    );
                    this.totalpageslength =
                        this.totalpageslength > 8 ? 8 : this.totalpageslength;
                })
                .catch(e => {
                    this.errors = e;
                });
        }
    }
};
</script>
<style scoped src="../styles/styles.css"></style>
