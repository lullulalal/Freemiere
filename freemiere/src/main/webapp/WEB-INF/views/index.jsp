<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Modus</title>
<meta name="description" content="">
<meta name="author" content="">

<!-- Bootstrap -->
<link rel="stylesheet" type="text/css"
	href="resources/main/css/bootstrap.css">
<link rel="stylesheet" type="text/css"
	href="resources/main/fonts/font-awesome/css/font-awesome.css">

<!-- Stylesheet
    ================================================== -->
<link rel="stylesheet" type="text/css" href="resources/main/css/style.css">
<link rel="stylesheet" type="text/css"
	href="resources/main/css/prettyPhoto.css">
<link
	href='http://fonts.googleapis.com/css?family=Open+Sans:400,700,800,600,300'
	rel='stylesheet' type='text/css'>

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body id="page-top" data-spy="scroll" data-target=".navbar-fixed-top">
	<div id="preloader">
		<div id="status">
			<img src="resources/main/img/preloader.gif" height="64" width="64" alt="">
		</div>
	</div>
	<!-- Navigation -->
	<!--  <nav class="navbar navbar-custom navbar-fixed-top" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-main-collapse"> <i class="fa fa-bars"></i> </button>
      <a class="navbar-brand page-scroll" href="#page-top"> <i class="fa fa-paper-plane-o"></i> Modus</a> </div>
     
    Collect the nav links, forms, and other content for toggling
    <div class="collapse navbar-collapse navbar-right navbar-main-collapse">
      <ul class="nav navbar-nav">
        Hidden li included to remove active class from about link when scrolled up past about section
        <li class="hidden"> <a href="#page-top"></a> </li>
        <li> <a class="page-scroll" href="#about">About</a> </li>
        <li> <a class="page-scroll" href="#services">Services</a> </li>
        <li> <a class="page-scroll" href="#works">Portfolio</a> </li>
        <li> <a class="page-scroll" href="#team">Team</a> </li>
        <li> <a class="page-scroll" href="#testimonials">Testimonials</a> </li>
        <li> <a class="page-scroll" href="#contact">Contact</a> </li>
      </ul>
    </div> 
   
    /.navbar-collapse 
  </div>
  /.container 
</nav> -->
	<!-- Header -->
	<div id="intro">
		<div class="intro-body">
			<div class="container">
				<div class="row">

					<!--         <div class="col-md-10 col-md-offset-1">
          <video autoplay loop muted poster="screenshot.jpg" class="video">
    <source src="http://techslides.com/demos/sample-videos/small.mp4" type="video/mp4">
</video> -->


					<h1>
						<span class="brand-heading">F R E E M I R E</span>
					</h1>
					<p class="intro-text">asdasd</p>
					<a href="#about" class="btn-login btn btn-default page-scroll">로그인</a>
				</div>
			</div>
		</div>
	</div>
	</div>
	<!-- About Section -->
	<div id="about">
		<div class="container">
			<div class="section-title text-center center">
				<h2>About us</h2>
				<hr>
			</div>
			<div class="col-md-8 col-md-offset-2">
				<h3>가입하셔요!</h3>
				<form action="login" method="post" name="sentMessage"
					id="contactForm" novalidate>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<input type="text" name="email" id="email" class="form-control"
									placeholder="Email" required="required">
								<p class="help-block text-danger"></p>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<input type="password" name="password" id="password"
									class="form-control" placeholder="PassWord" required="required">
								<p class="help-block text-danger"></p>
							</div>
						</div>
						<div id="success"></div>
						<button type="submit" class="btn btn-default">login</button>
						<a href="#contact" class="btn btn-default page-scroll">회원가입
							하셔요~!</a>
					</div>
				</form>
			</div>
			<!-- <div class="row">
      <div class="col-md-4"><img src="resources/img/about.jpg" class="img-responsive"></div>
      <div class="col-md-4">
        <div class="about-text">
          <h4>Who We Are</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam. Sed commodo nibh ante facilisis bibendum dolor feugiat at. Duis sed dapibus leo nec ornare diam commodo nibh.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam. Sed commodo nibh ante facilisis bibendum. </p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="about-text">
          <h4>What We Do</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam. Sed commodo nibh ante facilisis bibendum dolor feugiat at. Duis sed dapibus leo nec ornare diam.</p>
          <ul>
            <li>Lorem ipsum dolor sit amet</li>
            <li>Consectetur adipiscing commodo</li>
            <li>Duis sed dapibus leo sed dapibus</li>
            <li>Sed commodo nibh ante bibendum</li>
          </ul>
        </div>
      </div>
    </div> -->
		</div>
	</div>
	<!-- Services Section -->

		<div id="services" class="text-center">
			<div class="container">
				<div class="section-title center">
					<h2>간편하게 편집하세요.</h2>
					<hr>
			<!-- 	<div class="save"></div> -->
				
			<div class="service_edit">
						<i class="fa fa-film"></i>
						<h3>언제 어디서든</h3>
						<p>이용자가 어디에 있든 서버에 등록된 자료는 모두 확인가능합니다.</p>
					</div>
			
				</div>
				<div class="space"></div>
				<!--   <div class="row">
      <div class="col-md-10 col-md-offset-1">
        <div class="row testimonials">
          <div class="col-sm-4">
            <blockquote><i class="fa fa-quote-left"></i>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elitduis sed dapibus leo nec ornare.</p>
              <div class="clients-name">
                <p><strong>John Doe</strong><br>
                  <em>CEO, Company Inc.</em></p>
              </div>
            </blockquote>
          </div>
          <div class="col-sm-4">
            <blockquote><i class="fa fa-quote-left"></i>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elitduis sed dapibus leo nec ornare.</p>
              <div class="clients-name">
                <p><strong>Jane Doe</strong><br>
                  <em>CEO, Company Inc.</em></p>
              </div>
            </blockquote>
          </div>
          <div class="col-sm-4">
            <blockquote><i class="fa fa-quote-left"></i>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elitduis sed dapibus leo nec ornare.</p>
              <div class="clients-name">
                <p><strong>Chris Smith</strong><br>
                  <em>CEO, Company Inc.</em></p>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </div> -->
			</div>
		</div>

		<!-- Portfolio Section -->
		<!-- <div id="works">
  <div class="container"> Container
    <div class="section-title text-center center">
      <h2>Our Portfolio</h2>
      <hr>
      <div class="clearfix"></div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diamcommodo nibh ante facilisis.</p>
    </div>
    <div class="categories">
      <ul class="cat">
        <li>
          <ol class="type">
            <li><a href="#" data-filter="*" class="active">All</a></li>
            <li><a href="#" data-filter=".lorem">Web Design</a></li>
            <li><a href="#" data-filter=".consectetur">Web Development</a></li>
            <li><a href="#" data-filter=".dapibus">Branding</a></li>
          </ol>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
    <div class="row">
      <div class="portfolio-items">
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 lorem">
          <div class="portfolio-item">
            <div class="hover-bg"> <a href="resources/img/portfolio/01.jpg" title="Project description" rel="prettyPhoto">
              <div class="hover-text">
                <h4>Project Title</h4>
                <p>Web Design</p>
              </div>
              <img src="resources/img/portfolio/01.jpg" class="img-responsive" alt="Project Title"> </a> </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 consectetur">
          <div class="portfolio-item">
            <div class="hover-bg"> <a href="resources/img/portfolio/02.jpg" title="Project description" rel="prettyPhoto">
              <div class="hover-text">
                <h4>Project Title</h4>
                <p>Web Development</p>
              </div>
              <img src="resources/img/portfolio/02.jpg" class="img-responsive" alt="Project Title"> </a> </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 lorem">
          <div class="portfolio-item">
            <div class="hover-bg"> <a href="resources/img/portfolio/03.jpg" title="Project description" rel="prettyPhoto">
              <div class="hover-text">
                <h4>Project Title</h4>
                <p>Web Design</p>
              </div>
              <img src="resources/img/portfolio/03.jpg" class="img-responsive" alt="Project Title"> </a> </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 lorem">
          <div class="portfolio-item">
            <div class="hover-bg"> <a href="resources/img/portfolio/04.jpg" title="Project description" rel="prettyPhoto">
              <div class="hover-text">
                <h4>Project Title</h4>
                <p>Web Design</p>
              </div>
              <img src="resources/img/portfolio/04.jpg" class="img-responsive" alt="Project Title"> </a> </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 consectetur">
          <div class="portfolio-item">
            <div class="hover-bg"> <a href="resources/img/portfolio/05.jpg" title="Project description" rel="prettyPhoto">
              <div class="hover-text">
                <h4>Project Title</h4>
                <p>Web Development</p>
              </div>
              <img src="resources/img/portfolio/05.jpg" class="img-responsive" alt="Project Title"> </a> </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 dapibus">
          <div class="portfolio-item">
            <div class="hover-bg"> <a href="resources/img/portfolio/06.jpg" title="Project description" rel="prettyPhoto">
              <div class="hover-text">
                <h4>Project Title</h4>
                <p>Branding</p>
              </div>
              <img src="resources/img/portfolio/06.jpg" class="img-responsive" alt="Project Title"> </a> </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 dapibus consectetur">
          <div class="portfolio-item">
            <div class="hover-bg"> <a href="resources/img/portfolio/07.jpg" title="Project description" rel="prettyPhoto">
              <div class="hover-text">
                <h4>Project Title</h4>
                <p>Web Development, Branding</p>
              </div>
              <img src="resources/img/portfolio/07.jpg" class="img-responsive" alt="Project Title"> </a> </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 lorem">
          <div class="portfolio-item">
            <div class="hover-bg"> <a href="resources/img/portfolio/08.jpg" title="Project description" rel="prettyPhoto">
              <div class="hover-text">
                <h4>Project Title</h4>
                <p>Web Design</p>
              </div>
              <img src="resources/img/portfolio/08.jpg" class="img-responsive" alt="Project Title"> </a> </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> -->
		<!-- Team Section -->
		<div id="team" class="text-center">
			<div class="container">
				<div class="section-title center">
					<h2>언제 어디서든 공유하세요.</h2>
					<hr>
					<i class="fa fa-share-alt"></i>
						<h3>언제 어디서든</h3>
						<p>이용자가 어디에 있든 서버에 등록된 자료는 모두 확인가능합니다.</p>
				</div>
				<div class="share"></div>
				<!-- <div id="row">
      <div class="col-xs-6 col-md-3 col-sm-6">
        <div class="thumbnail"> <img src="resources/img/team/01.jpg" alt="..." class="img-thumbnail team-img">
          <div class="caption">
            <h3>John Doe</h3>
            <p>Founder / CEO</p>
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-md-3 col-sm-6">
        <div class="thumbnail"> <img src="resources/img/team/02.jpg" alt="..." class="img-thumbnail team-img">
          <div class="caption">
            <h3>Mike Doe</h3>
            <p>Web Designer</p>
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-md-3 col-sm-6">
        <div class="thumbnail"> <img src="resources/img/team/03.jpg" alt="..." class="img-thumbnail team-img">
          <div class="caption">
            <h3>Jane Doe</h3>
            <p>Creative Director</p>
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-md-3 col-sm-6">
        <div class="thumbnail"> <img src="resources/img/team/04.jpg" alt="..." class="img-thumbnail team-img">
          <div class="caption">
            <h3>Larry Show</h3>
            <p>Project Manager</p>
          </div>
        </div>
      </div>
    </div> -->
			</div>
		</div>
		<!-- Testimonials Section -->
		<div id="testimonials" class="text-center">
			<div class="container">
			
				<div class="section-title center">
					<h2>소중한 추억을 남기세요.</h2>
					<hr>
					<i class="fa fa-share-alt"></i>
						<h3>언제 어디서든</h3>
						<p>이용자가 어디에 있든 서버에 등록된 자료는 모두 확인가능합니다.</p>
				</div>
				<div class="save"></div>
				<!--   <div class="row">
      <div class="col-md-10 col-md-offset-1">
        <div class="row testimonials">
          <div class="col-sm-4">
            <blockquote><i class="fa fa-quote-left"></i>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elitduis sed dapibus leo nec ornare.</p>
              <div class="clients-name">
                <p><strong>John Doe</strong><br>
                  <em>CEO, Company Inc.</em></p>
              </div>
            </blockquote>
          </div>
          <div class="col-sm-4">
            <blockquote><i class="fa fa-quote-left"></i>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elitduis sed dapibus leo nec ornare.</p>
              <div class="clients-name">
                <p><strong>Jane Doe</strong><br>
                  <em>CEO, Company Inc.</em></p>
              </div>
            </blockquote>
          </div>
          <div class="col-sm-4">
            <blockquote><i class="fa fa-quote-left"></i>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elitduis sed dapibus leo nec ornare.</p>
              <div class="clients-name">
                <p><strong>Chris Smith</strong><br>
                  <em>CEO, Company Inc.</em></p>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </div> -->
			</div>
		</div>

		<!-- Contact Section -->
		<div id="contact" class="text-center">
			<!-- <div class="container">
  
        <div class="form-group">
          <textarea name="message" id="message" class="form-control" rows="4" placeholder="Message" required></textarea>
          <p class="help-block text-danger"></p>
        </div>  -->
			<div class="col-md-8 col-md-offset-2">
				<h3>가입하셔요!</h3>
				<form name="sentMessage" id="contactForm" novalidate>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<input type="text" id="name" class="form-control"
									placeholder="Email" required="required">
								<p class="help-block text-danger"></p>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<input type="password" id="email" class="form-control"
									placeholder="PassWord" required="required">
								<p class="help-block text-danger"></p>
							</div>
						</div>
						<div id="success"></div>
						<button type="submit" class="btn btn-default">Join</button>
				</form>
				<div class="section-title center">
					<h2>Contact us</h2>
					<hr>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Duis sed dapibus leo nec ornare diamcommodo nibh ante facilisis.</p>
				</div>
				<div class="col-md-8 col-md-offset-2">
					<div class="col-md-4">
						<div class="contact-item">
							<i class="fa fa-map-marker fa-2x"></i>
							<p>
								4321 California St,<br> San Francisco, CA 12345
							</p>
						</div>
					</div>
					<div class="col-md-4">
						<div class="contact-item">
							<i class="fa fa-envelope-o fa-2x"></i>
							<p>info@company.com</p>
						</div>
					</div>
					<div class="col-md-4">
						<div class="contact-item">
							<i class="fa fa-phone fa-2x"></i>
							<p>
								+1 123 456 1234<br> +1 321 456 1234
							</p>
						</div>
					</div>
					<div class="clearfix"></div>
				</div>

				<!-- <div class="social">
        <h3>Follow us</h3>
        <ul>
          <li><a href="#"><i class="fa fa-facebook"></i></a></li>
          <li><a href="#"><i class="fa fa-twitter"></i></a></li>
          <li><a href="#"><i class="fa fa-dribbble"></i></a></li>
          <li><a href="#"><i class="fa fa-github"></i></a></li>
          <li><a href="#"><i class="fa fa-instagram"></i></a></li>
          <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
        </ul>
      </div> -->
			</div>
		</div>
	</div>

	<div>
		<div class="qqqq"
			style="position: fixed; bottom: 5px; right: 5px; opacity: 100;">
			<!-- 상위메뉴로가기 버튼 -->

			<!-- <nav class="navbar navbar-default navbar-fixed-bottom">
        <div class="navbar-inner navbar-content-center">
         <a href="#page-top" class="btn btn-default page-scroll">▲</a>
        </div>
    </nav>
     -->
			<nav class="navbar">
				<a href="#page-top" class="btn btn-default page-scroll">Top</a>
			</nav>
		</div>
	</div>
	<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
	<script type="text/javascript" src="resources/main/js/jquery.1.11.1.js"></script>
	<!-- Include all compiled plugins (below), or include individual files as needed -->
	<script type="text/javascript" src="resources/main/js/bootstrap.js"></script>
	<script type="text/javascript" src="resources/main/js/SmoothScroll.js"></script>
	<script type="text/javascript" src="resources/main/js/jquery.prettyPhoto.js"></script>
	<script type="text/javascript" src="resources/main/js/jquery.isotope.js"></script>
	<script type="text/javascript" src="resources/main/js/jquery.parallax.js"></script>
	<script type="text/javascript"
		src="resources/main/js/jqBootstrapValidation.js"></script>
	<!-- <script type="text/javascript" src="resources/js/contact_me.js"></script>  -->

	<!-- Javascripts
    ================================================== -->
	<script type="text/javascript" src="resources/main/js/main.js"></script>
</body>
</html>