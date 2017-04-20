package com.sc32c3.freemiere.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class EditorController {
	private static final Logger logger = LoggerFactory.getLogger(EditorController.class);
	
	@RequestMapping(value = "editorTest", method = RequestMethod.GET)
	public String editorTest(){
    	logger.info("서버:editorTest 실행 ");
    	
		return "editor";
    }
}
