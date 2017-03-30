package com.sc32c3.freemiere.controller;

import java.io.File;
import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sc32c3.freemiere.dao.FileFolderDAO;
import com.sc32c3.freemiere.util.FileManager;
import com.sc32c3.freemiere.vo.FileFolder;


@Controller
public class FileFolderController {
	
	private static final Logger logger = LoggerFactory.getLogger(FileFolderController.class);
 
	@Autowired
	FileFolderDAO fileFolderDAO;

	
    @RequestMapping(value = "/storage", method = RequestMethod.GET)
    public String storage() {
    	
        return "storage";
    }
    
    @ResponseBody
	@RequestMapping(value = "loadTrash", method = RequestMethod.GET ,
					produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadTrash(){
    	logger.info("?쒕쾭:loadTrash ?ㅽ뻾 ");
    	
    	String email="lullulalal@naver.com";//?몄뀡??email??媛?몄??쇳븿.
    	ArrayList<FileFolder> rtn = fileFolderDAO.getTrashList(email);
    	
    	for(FileFolder ff : rtn){
    		File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
    	}
    	
		return rtn;
    }
    
    @ResponseBody
	@RequestMapping(value = "loadShared", method = RequestMethod.GET ,
					produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadShared(){
    	logger.info("?쒕쾭:loadShared ?ㅽ뻾 ");
    	
    	String email="lullulalal@naver.com";//?몄뀡??email??媛?몄??쇳븿.
    	ArrayList<FileFolder> rtn = fileFolderDAO.getSharedList(email);
    	
    	for(FileFolder ff : rtn){
    		File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
    	}
    	
		return rtn;
    }
    
	@ResponseBody
	@RequestMapping(value = "loadBookmark", method = RequestMethod.GET ,
					produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadBookmark(){
		
		logger.info("?쒕쾭:loadBookmark ?ㅽ뻾 ");
		
    	String email="lullulalal@naver.com";//?몄뀡??email??媛?몄??쇳븿.
    	ArrayList<FileFolder> myStorageList = fileFolderDAO.getMyStorageBookmarkList(email);
    	ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedBookmarkList(email);
    	myStorageList.addAll(sharedList);
    	
    	for(FileFolder ff : myStorageList){
    		File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
    	}
    	
    	
		return myStorageList;
	}
    
	@ResponseBody
	@RequestMapping(value = "loadMyStorage", method = RequestMethod.GET ,
					produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadMyStorage(){
		
		logger.info("?쒕쾭:loadMyStorage ?ㅽ뻾 ");
		
    	String email="lullulalal@naver.com";//?몄뀡??email??媛?몄??쇳븿.
    	ArrayList<FileFolder> myStorageList = fileFolderDAO.getMyStorageList(email);
    	ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedList(email);
    	myStorageList.addAll(sharedList);
    	
    	for(FileFolder ff : myStorageList){
    		File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
    	}
    	
		return myStorageList;
	}
	
	@ResponseBody
	@RequestMapping(value = "loadList", method = RequestMethod.GET ,
					produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadList(String path){
		
		logger.info("?쒕쾭:loadList ?ㅽ뻾 " + path);
		String loadPath = path;
		if(path.charAt(path.length()-1) != '\\')
			loadPath += "\\";
		System.out.println(loadPath);
		File[] files = FileManager.findFile(loadPath);
		ArrayList<FileFolder> rtn = new ArrayList<>();
		String email="lullulalal@naver.com";
		FileManager.fileSort( files );

		for( File f : files ) {
			String p = f.getAbsolutePath();
			if(f.isDirectory()==true)
				p += "\\";
			System.out.println(p);
			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email );
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
			rtn.add(ff);
		}

		return rtn;
	}
	
	
	
	
	//여기서부터는 컨텍스트메뉴 관련
	
	@RequestMapping(value = "createMovie", method = RequestMethod.GET)
    public String createMovie() {
    	
        return "createMovie";
    }
	
	
	@ResponseBody
	@RequestMapping(value="bookmarkUpdate", method=RequestMethod.POST)
	public void bookmarkUpdate(int ffid){
		
		int result = 0;
		System.out.print("ffid가 무엇이더냐 : "+ffid);
		try{
			result = fileFolderDAO.bookmarkUpdate(ffid); 
		}catch (Exception e) {
			// TODO: handle exception
			result = 1;
		}

	}
	
}

