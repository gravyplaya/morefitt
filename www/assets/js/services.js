angular.module('starter.services',[])
.service('WC', function(){
    return {
        WC: function(){
            var Woocommerce = new WooCommerceAPI.WooCommerceAPI({
                url: 'https://jonb.morefitt.com',
                consumerKey: 'ck_18425d62fbcf030b0c8e052c6572249c1cec3fec',
                consumerSecret: 'cs_0d60546ec1a872bedaa0792bc11038d5b5cfb91f'
            });
            return Woocommerce;
        }
}});