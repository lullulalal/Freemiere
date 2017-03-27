package com.sc32c3.freemiere.controller;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.sc32c3.freemiere.dao.MemberDAO;
import com.sc32c3.freemiere.vo.Member;

@Controller
public class MainController {
	@Autowired
	MemberDAO memberDAO;
	private static final Logger logger = LoggerFactory.getLogger(MainController.class);

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String index() {
		return "index";
	}
	
	@RequestMapping(value = "login", method = RequestMethod.POST)
	public String login(Member member, HttpSession session){
		Member memberInfo = memberDAO.getMember(member.getEmail());
		if(member.getPassword().equals(memberInfo.getPassword())) {
			session.setAttribute("loginMem", member.getEmail());
			return "storage";
		}
		else
			return "redirect:/";
	}
}

