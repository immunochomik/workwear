
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
                    <li id="topNavLiCurrent" class="active nav-li"><a href="/#!/current">Current<span class="sr-only">(current)</span></a></li>
                    <li id="topNavLiCalendar" class="nav-li"><a href="/#!/calendar">Calendar</a></li>
                    <li id="topNavLiBackBurner" class="nav-li" ><a href="/#!/todo">Back Burner</a></li>
                    <li id="topNavLiSummary" class="nav-li"><a href="/#!/analysis">Summary</a></li>
                    <li id="topNavLiData" class="nav-li" ><a href="/#!/data">Data</a></li>
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
