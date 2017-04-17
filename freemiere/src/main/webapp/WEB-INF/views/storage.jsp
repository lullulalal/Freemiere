<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<title>FREEMIERE STORAGE</title>
<link href="https://fonts.googleapis.com/css?family=Cinzel+Decorative|Megrim" rel="stylesheet">

<!-- 나눔바른고딕 -->
<link href='https://cdn.rawgit.com/openhiun/hangul/14c0f6faa2941116bb53001d6a7dcd5e82300c3f/nanumbarungothic.css' rel='stylesheet' type='text/css'>

<!-- 새폴더 modal CSS -->
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">

<!-- Bootstrap Core CSS -->
<link href="resources/vendor/bootstrap/css/bootstrap.css"
	rel="stylesheet">

<!-- MetisMenu CSS -->
<link href="resources/vendor/metisMenu/metisMenu.min.css"
	rel="stylesheet">

<!-- Custom CSS -->
<link href="resources/dist/css/sb-admin-2.css" rel="stylesheet">

<!-- Custom Fonts -->
<link href="resources/vendor/font-awesome/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">

<!-- Storage CSS -->
<link href="resources/css/storage/storage.css" rel="stylesheet">


<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>
	<!-- 새폴더 id resources/js/storage 자바스크립트 처리 ===========-->
	<div id="newFolder" class="w3-modal"></div>
	<!-- ========================================================== -->
	<div id="wrapper">

		<!-- Navigation -->
		 <nav class="navbar navbar-default navbar-static-top" role="navigation"
         style="margin-bottom: 0">
         <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse"
               data-target=".navbar-collapse">
               <span class="sr-only">Toggle navigation</span> <span
                  class="icon-bar"></span> <span class="icon-bar"></span> <span
                  class="icon-bar"></span>
            </button>
            <a class="navbar-brand">FREEMIERE - STORAGE :</a>
            <span id="navigator"> </span>
                     <span id="navigator"> </span>
               
         </div>
			<!-- navbar- sidebar -->
			<div class="navbar-default sidebar" role="navigation">
				<div class="sidebar-nav navbar-collapse">
					<ul class="nav" id="side-menu">
						<li class="sidebar-search">
							<div class="input-group custom-search-form">
								<input type="text" class="form-control" placeholder="Search...">
								<span class="input-group-btn">
									<button class="btn btn-default" type="button">
										<i class="fa fa-search"></i>
									</button>
								</span>
							</div> <!-- /input-group -->
						</li>
						<br><br>
						<img src="./resources/img/storage/womanIcon.png" class="profile-icon">
						<div class="accountName">${rootDir }</div>
						<div class="accountVolume">사용중인 용량 : ${accountVolume}</div>
						<br>
						<li><a id='myStorage' class='sideMenu'><i
								class="fa fa-dashboard fa-fw"></i> 내 저장소</a></li>
						<li><a id='shared' class='sideMenu'><i
								class="fa fa-sitemap fa-fw"></i> 공유 저장소</a></li>
						<li><a id='recent' class='sideMenu'><i
								class="fa fa-bar-chart-o fa-fw"></i> 최근 사용 저장소</a></li>
						<li><a id='bookMark' class='sideMenu'><i
								class="fa fa-edit fa-fw"></i> 즐겨찾기</a></li>
						<li><a id='trash' class='sideMenu'><i
								class="fa fa-table fa-fw"></i> 휴지통</a></li>


					</ul>
				</div>
				<!-- /.sidebar-collapse -->
			</div>
			<!-- /.navbar-static-side -->
		</nav>

		<!-- Page Content -->
		<div id="page-wrapper">
			<div class="container-fluid">
				<div class="row">
						<div class="col-lg-12">
							<div class="container-fluid" id = "setNavTop">
                  			</div>
						</div>
					</div>
					<!-- /.row -->
				<div id="dragDropZone" >
					<div id="outputList"></div>
					
				<!-- /.container-fluid -->
			</div>
			<!--/#dragDropZone  -->
		</div>
		<!-- /#page-wrapper -->
	</div>

	<!-- /#wrapper -->

	<!-- MODAL -->
	<div class="modal fade" id="modal-register" tabindex="-1" role="dialog"
		aria-labelledby="modal-register-label" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
					</button>
					<h3 class="modal-title" id="modal-register-label">새 폴더 만들기</h3>
				</div>

				<div class="modal-body">

					<form role="form" action="" method="post" class="registration-form">
						<div class="form-group">
							<label class="sr-only" for="form-first-name">새폴더</label> <input
								type="text" name="form-first-name" placeholder="폴더명을 입력하세요"
								class="form-first-name form-control" id="form-first-name">
						</div>
						<button type="submit" class="btn">확인</button>
					</form>
				</div>
			</div>
		</div>
	</div>



	<script>
		var loginMem = '${loginMem}';
	</script>
	<!-- jQuery -->
	<script src="resources/vendor/jquery/jquery.min.js"></script>

	<!-- Bootstrap Core JavaScript -->
	<script src="resources/vendor/bootstrap/js/bootstrap.min.js"></script>

	<!-- Metis Menu Plugin JavaScript -->
	<script src="resources/vendor/metisMenu/metisMenu.min.js"></script>

	<!-- Custom Theme JavaScript -->
	<script src="resources/dist/js/sb-admin-2.js"></script>

	<!-- Storage JavaScript -->
	<script src="resources/js/storage/storage.js"></script>

	<script src="resources/newDirModal/js/jquery.backstretch.min.js"></script>
	<script src="resources/newDirModal/js/scripts.js"></script>
</body>

</html>
