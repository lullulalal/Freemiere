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


<title>F R E E M I R E</title>

<!-- Bootstrap Core CSS -->
<link href="resources/main/css/bootstrap.css" rel="stylesheet">

<!-- Custom CSS -->
<link href="resources/main/css/half-slider.css" rel="stylesheet">



<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>

	<!-- Navigation -->
	<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
		<div class="container">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse"
					data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span> <span
						class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#"><img src="resources/main/img/Untitled-6.png" style="width: 140px; height: 30px; vertical-align: top;"></a>
			</div>
			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse"
				id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav">
					<!--  <li>
                        <a href="#">About</a>
                    </li>
                    <li>
                        <a href="#">Services</a>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li> -->
				</ul>
			</div>
			<!-- /.navbar-collapse -->
		</div>
		<!-- /.container -->
	</nav>

	<!-- Half Page Image Background Carousel Header -->
	<header id="myCarousel" class="carousel slide">
		<!-- Indicators -->
		<ol class="carousel-indicators">
			<li data-target="#myCarousel" data-slide-to="0" class="active"></li>
			<li data-target="#myCarousel" data-slide-to="1"></li>
			<li data-target="#myCarousel" data-slide-to="2"></li>
		</ol>

		<!-- Wrapper for Slides -->
		<div class="carousel-inner">
			<div class="item active">
				Set the first background image using inline CSS below.
				<div class="fill"
					style="background-image: url('resources/main/img/main_1.png');"></div>
				<div class="carousel-caption">
					<!--  <h2>Caption 1</h2> -->
				</div>
			</div>
			<div class="item">
				Set the second background image using inline CSS below.
				<div class="fill"
					style="background-image: url('resources/main/img/main_2_image.png');"></div>
				<div class="carousel-caption">
					<!-- <h2>Caption 2</h2> -->
				</div>
			</div>
			<div class="item">
				Set the third background image using inline CSS below.
				<div class="fill"
					style="background-image: url('resources/main/img/main_3.png');"></div>
				<div class="carousel-caption">
					<!-- <h2>Caption 3</h2> -->
				</div>
			</div>
		</div>

		<!-- Controls -->
		<a class="left carousel-control" href="#myCarousel" data-slide="prev">
			<span class="icon-prev"></span>
		</a> <a class="right carousel-control" href="#myCarousel"
			data-slide="next"> <span class="icon-next"></span>
		</a>

	</header>

	<!-- Page Content -->
	<div class="container">

		<div class="row">
			<div class="col-lg-12">
				<div class="left-box">
				<i class="fa fa-heart fa-5x" aria-hidden="true"></i>	
					<h3>모두를 위한 비디오 제작.</h3>
					<br><br>
					<p>
						이제 간단한 인터페이스로 초보자라면 누구라도 쉽게 영상을 만들 수 있습니다.
						<!-- <code>half-slider.css</code>
						file. -->
					</p>
				</div>
				<div class="left-box2">
				<i class="fa fa-desktop fa-5x" aria-hidden="true"></i>
				<h3>어디서든 편집하십시오.</h3>
				<br><br>
					<p>
						포함된 스토리지에서 사진, 비디오 및 오디오를 언제 어디서나 편집하고 볼 수 있습니다. 
						<!-- <code>half-slider.css</code>
						file. -->
					</p>
				</div>
				<div class="left-box3">
				<i class="fa fa-bolt fa-5x" aria-hidden="true"></i>
				<h3>쉽고 빠릅니다.</h3>
				<br><br>
					<p>
						편집모드를 선택하여 아이디어를 몇 분 만에 놀라운 영화로 바꿀 수 있습니다.
						<!-- <code>half-slider.css</code>
						file. -->
					</p>
				</div>
				<div class="right-box">
				<br>
					<p style="color: #26b999; font-size: 25px;">이야기를 들려주세요</p>
					<br>
					<form class="login-form" action="login" method="post">
						<p class="login-text">
							<span class="fa-stack fa-lg"> 
								<i class="fa fa-circle fa-stack-2x"></i> 
								<i class="fa fa-lock fa-stack-1x"></i>
							</span>
						</p>
							<input type="email" class="login-username" autofocus="true"  name="email" id="email" 
								required="true" placeholder="Email" />
							<input type="password" class="login-password" autofocus="true" name="password" id="password"
								required="true" placeholder="Password" />
							<input type="submit" name="Login" value="　로그인　" class="login-submit" />
					</form>
					<!-- <a href="#" class="login-forgot-pass">forgot password?</a> -->
					<!-- <div class="underlay-photo"></div> -->
					<!-- <div class="underlay-black"></div> -->
				</div>
			</div>
		</div>

		<hr>

		<!-- Footer -->
		<footer>
			<div class="row">
				<div class="col-lg-12">
					<p></p>
				</div>
			</div>
			<!-- /.row -->
		</footer>

	</div>
	<!-- /.container -->

	<!-- jQuery -->
	<script src="resources/main/js/jquery.js"></script>

	<!-- Bootstrap Core JavaScript -->
	<script src="resources/main/js/bootstrap.min.js"></script>

	<!-- Script to Activate the Carousel -->
	<script>
		$('.carousel').carousel({
			interval : 5000
		//changes the speed
		})
	</script>

</body>

</html>
