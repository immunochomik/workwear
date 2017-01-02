
<template>
    <!-- Navigation -->
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">{{title}}</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li id="topNavLiWorkers" class="active nav-li"><a href="/#!/workers">Workers</a></li>
                    <li id="topNavLiReleaseHistory" class="nav-li"><a href="/#!/release-history">Release History</a></li>
                    <li id="topNavLiInventory" class="nav-li"><a href="/#!/inventory">Inventory</a></li>
                    <li id="topNavLiWorkwearTypes" class="nav-li"><a href="/#!/workweartypes">Workwear Types</a></li>
                    <li id="topNavLiWorkPositions" class="nav-li"><a href="/#!/workpositions">Work Positions</a></li>
                    <li id="topNavLiData" class="nav-li"><a href="/#!/data">data</a></li>
                </ul>
            </div><!--/.nav-collapse -->
        </div><!--/.container-fluid -->
    </nav>
</template>

<script>
    export default {
        name: 'TopNav',
        methods: {
            toggleActive : function(id) {
              toggleTopNavActive(id);
            }
        },
        data : function () {
            return {
                title: 'Foo Doo'
            }
        }
    }
</script>

<style>
</style>
