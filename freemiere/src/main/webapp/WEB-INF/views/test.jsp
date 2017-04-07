<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<title>Bootstrap Modal Registration Form Template</title>

<!-- CSS -->
<link rel="stylesheet"
	href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,500">
<link rel="stylesheet"
	href="resources/newDirModal/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet"
	href="resources/newDirModal/css/form-elements.css">
<link rel="stylesheet" href="resources/newDirModal/css/style.css">

<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->



</head>

<body>

	<!-- Content -->
	<!-- <div class="top-content"> -->

		<div class="top-big-link">
			<a class="btn btn-link-1 launch-modal" href="#"
				data-modal-id="modal-register">새폴더</a>
		</div>

<!-- 	</div> -->

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


	<!-- Javascript -->
	<script src="resources/newDirModal/js/jquery-1.11.1.min.js"></script>
	<script src="resources/newDirModal/bootstrap/js/bootstrap.min.js"></script>
	<script src="resources/newDirModal/js/jquery.backstretch.min.js"></script>
	<script src="resources/newDirModal/js/scripts.js"></script>

	<!--[if lt IE 10]>
            <script src="assets/js/placeholder.js"></script>
        <![endif]-->

</body>

</html>