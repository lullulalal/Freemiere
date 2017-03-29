package com.sc32c3.freemiere.controller;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

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
    	logger.info("서버:loadTrash 실행 ");
    	
    	String email="lullulalal@naver.com";//세션의 email을 가져와야함.
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
    	logger.info("서버:loadShared 실행 ");
    	
    	String email="lullulalal@naver.com";//세션의 email을 가져와야함.
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
		
		logger.info("서버:loadBookmark 실행 ");
		
    	String email="lullulalal@naver.com";//세션의 email을 가져와야함.
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
		
		logger.info("서버:loadMyStorage 실행 ");
		
    	String email="lullulalal@naver.com";//세션의 email을 가져와야함.
    	ArrayList<FileFolder> myStorageList = fileFolderDAO.getMyStorageList(email);
    	ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedList(email);
    	myStorageList.addAll(sharedList);
    	
    	for(FileFolder ff : myStorageList){
    		System.out.println(ff.getPath());
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
		
		logger.info("서버:loadList 실행 " + path);
		String loadPath = path;
		if(path.charAt(path.length()-1) != '\\')
			loadPath += "\\";
		System.out.println(loadPath);
		File[] files = FileManager.findFile(loadPath);
		ArrayList<FileFolder> rtn = new ArrayList<>();

		FileManager.fileSort( files );

		for( File f : files ) {
			SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");//수정된 날짜 출력
			System.out.println(sf.format(f.lastModified()));
			
			String p = f.getAbsolutePath();
			if(f.isDirectory()==true)
				p += "\\";
			System.out.println(p);
			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p);
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
			rtn.add(ff);
		}

		return rtn;
	}
	
	
}
