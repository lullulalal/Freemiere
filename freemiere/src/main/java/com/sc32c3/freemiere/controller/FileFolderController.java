package com.sc32c3.freemiere.controller;

import java.io.File;
import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sc32c3.freemiere.dao.FileFolderDAO;
import com.sc32c3.freemiere.util.FileManager;
import com.sc32c3.freemiere.vo.FileFolder;


@Controller
public class FileFolderController {
	
	private static final Logger logger = LoggerFactory.getLogger(FileFolderController.class);
	
	final String uploadPath = "/freemiere/"; // 파일 업로드 경로
 
	@Autowired
	FileFolderDAO fileFolderDAO;

    //@RequestMapping(value = "storage", method = RequestMethod.GET)
    //public String storage() {
    //	System.out.println("??");
    //    return "storage";
   // }
    
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
			System.out.println(p);
			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email);
			if(ff == null) continue;
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
			rtn.add(ff);
		}

		return rtn;
	}
	//휴지통으로 이동
	@ResponseBody
	@RequestMapping(value="deleteFileFolder", method = RequestMethod.POST)
	public int deleteFileFolder(String[] ffid
								,String[] isshared
								,String[] bookState
								,HttpSession session){
		
		logger.debug("ffid={}",ffid);
		logger.debug("issshared{}",isshared);
		logger.debug("book{}",bookState);
		
		int result = 0;
		String email = (String) session.getAttribute("loginMem");

		for(int i=0; i<isshared.length;i++){
			
			//공유 아닌 파일
			if(isshared[i].equalsIgnoreCase("F")){
				if(bookState[i].equalsIgnoreCase("F")){
				fileFolderDAO.deleteFileFolder(Integer.parseInt(ffid[i]));
			}else{
				//공유는 아니고 북파크 표시 폴더
				fileFolderDAO.deleteBookmarks(Integer.parseInt(ffid[i]),bookState[i]);
				fileFolderDAO.deleteFileFolder(Integer.parseInt(ffid[i]));
				}
			}else if(isshared[i].equalsIgnoreCase("T")){
				if(bookState[i].equalsIgnoreCase("T")){
					//공유&북마크폴더
					fileFolderDAO.deleteShare(Integer.parseInt(ffid[i]), email);
					fileFolderDAO.deleteBookmarks(Integer.parseInt(ffid[i]),bookState[i]);
				}else{
					fileFolderDAO.deleteShare(Integer.parseInt(ffid[i]), email);
				}
			}
		}
		
		return result;
	}


}
