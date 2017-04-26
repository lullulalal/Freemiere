package com.sc32c3.freemiere.controller;

import java.io.File;
import java.text.DecimalFormat;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.sc32c3.freemiere.dao.MemberDAO;
import com.sc32c3.freemiere.util.FileManager;
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
	public String login(Member member, HttpSession session, Model model) {
		Member memberInfo = memberDAO.getMember(member.getEmail());
		if (memberInfo == null)
			return "redirect:/";
		if (member.getPassword().equals(memberInfo.getPassword())) {
			session.setAttribute("loginMem", member.getEmail());
			// 현재 꼐정의 폴더 싸이즈임미당~츄
			File rootDir = new File("c:\\freemiere\\" + member.getEmail());
			long size = FileManager.getFileFolderSize(rootDir);
			Double unitConvertKB = (double) (size / 1024);
			Double unitConvertMB = (double) Math.round((size / 1024 / 1024));
			Double unitConvertMB2 = (double) (size / 1024 / 1024);
			Double unitConvertGB = (double) Math.round((unitConvertMB2 / 1024) * 100) / 100.0;

			System.out.println(unitConvertGB);

			if (size > 1024*1024*1024) {
				String unit = "GB";
				System.out.println(unitConvertGB + unit + " / 20GB");
				model.addAttribute("accountVolume", unitConvertGB + unit + " / 20GB");
			} else if (size > 1024*1024) {
				String unit = "MB";
				model.addAttribute("accountVolume", unitConvertMB + unit + " / 20GB");
			} else if(size > 1024) {
				String unit = "KB";
				model.addAttribute("accountVolume", unitConvertKB + unit + " / 20GB");
			}
			model.addAttribute("rootDir", rootDir.getName());
			return "storage";
		} else
			return "redirect:/";
	}
	//로그아웃
	 @RequestMapping(value="logout", method = RequestMethod.GET)
     public String logout(HttpSession session){
        System.out.println("로그아웃");
        session.invalidate();
        
        return "redirect:/";
     }
	
	
}
