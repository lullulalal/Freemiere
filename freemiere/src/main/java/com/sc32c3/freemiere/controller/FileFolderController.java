package com.sc32c3.freemiere.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
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

	
	final String uploadPage = "/boardfile";
   
    @ResponseBody
	@RequestMapping(value = "loadTrash", method = RequestMethod.GET ,
					produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadTrash(HttpSession session){
    	logger.info("서버:loadTrash 실행 ");
    	
    	String email= (String)session.getAttribute("loginMem");
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
	public ArrayList<FileFolder> loadShared(HttpSession session){
    	logger.info("서버:loadShared 실행 ");
    	
    	String email= (String)session.getAttribute("loginMem");
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
	public ArrayList<FileFolder> loadBookmark(HttpSession session){
		
		logger.info("서버:loadBookmark 실행 ");
		
		String email= (String)session.getAttribute("loginMem");
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
	public ArrayList<FileFolder> loadMyStorage(HttpSession session){
		
		logger.info("서버:loadMyStorage 실행 ");
		
		String email= (String)session.getAttribute("loginMem");
    	
		//ArrayList<FileFolder> myStorageList = fileFolderDAO.getMyStorageList(email);
		
		ArrayList<FileFolder> myStorageList = loadList("c:\\freemiere\\" + email, session);
    	ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedList(email);
    	
    	for(FileFolder ff : sharedList){
    		File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
    	}
    	
    	myStorageList.addAll(sharedList);
    	
		return myStorageList;
	}
	
	@ResponseBody
	@RequestMapping(value = "loadList", method = RequestMethod.GET ,
					produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadList(String path, HttpSession session){
		
		logger.info("서버:loadList 실행 " + path);
		
		String email= (String)session.getAttribute("loginMem");
		
		String loadPath = path;
		if(path.charAt(path.length()-1) != '\\')
			loadPath += "\\";
		System.out.println(loadPath);
		File[] files = FileManager.findFile(loadPath);
		ArrayList<FileFolder> rtn = new ArrayList<>();
		
		FileManager.fileSort( files );

		for( File f : files ) {
			String p = f.getAbsolutePath();
			if(f.isDirectory()==true)
				p += "\\";
			System.out.println("경로데스까?"+p);
			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email);
			if(ff == null) continue;
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
	public void bookmarkUpdate(int ffid, String bookstate){
		
		int result = 0;
		System.out.print("ffid가 무엇이더냐 : "+ffid);
		System.out.println("bookstate는 무었이더냐"+bookstate);
		try{
			result = fileFolderDAO.bookmarkUpdate(ffid,bookstate); 
		}catch (Exception e) {
			// TODO: handle exception
			result = 1;
		}
	}
	
	
	
	
	@ResponseBody
	@RequestMapping(value = "download", method = RequestMethod.GET)
	public String download(int ffid, HttpServletResponse response) {
		// 전달된 글번호로 글정보 검색
		FileFolder list = fileFolderDAO.boardread(ffid);
		
	
		// 클라이언트로 전달할 출력스트림으로 복사
		String fullPath = uploadPage + "/" + list.getPath();

		try {
			FileInputStream is = new FileInputStream(fullPath);
			ServletOutputStream out = response.getOutputStream();

			FileCopyUtils.copy(is, out);
			is.close();
			out.close();

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

}

