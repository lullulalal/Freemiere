	package com.sc32c3.freemiere.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

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
	public void bookmarkUpdate(int ffid, String bookstate, HttpSession session){
		
		FileFolder search = fileFolderDAO.bookmarkSearch(ffid);
		String email= (String)session.getAttribute("loginMem");
		
		System.out.println("너는 과연 있니?" + search);
		int result = 0;
		int insert = 0;
		if(search == null){
			try {
				insert = fileFolderDAO.bookmarkInsert(ffid, email);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		else{
			try{
				result = fileFolderDAO.bookmarkUpdate(ffid,bookstate); 
			}catch (Exception e) {
				// TODO: handle exception
			}
		}
		
		/*int result = 0;
		String email= (String)session.getAttribute("loginMem");
		System.out.print("ffid가 무엇이더냐 : "+ffid);
		System.out.println("bookstate는 무었이더냐"+bookstate);
		try{
			result = fileFolderDAO.bookmarkUpdate(ffid,bookstate); 
		}catch (Exception e) {
			// TODO: handle exception
			result = fileFolderDAO.bookmarkInsert(ffid, email);
		}*/
	}
	
	//폴더공유버튼
	@ResponseBody
	@RequestMapping(value="folderShare", method=RequestMethod.POST)
	public void folderShare(int ffid, String isShared, HttpSession session){
		
		
	}
	
	//
	@ResponseBody
	@RequestMapping(value="pathUpdate", method=RequestMethod.POST)
	public FileFolder pathUpdate(int ffid, String isShared, HttpSession session){
		
		logger.info("너의 ffid는...? " + ffid);
		
		String email= (String)session.getAttribute("loginMem");
		
		FileFolder getFile = fileFolderDAO.boardread(ffid);
		
		System.out.println(getFile);
		File f = new File(getFile.getPath());
		
		//f.rename();
		
		Path pathd = Paths.get(getFile.getPath());
		
		//폴더일경우
		if (f.isDirectory()) {
			try {
				BasicFileAttributes attr = Files.readAttributes(pathd, BasicFileAttributes.class);

				//파일명
				getFile.setFileName(f.getName());
				
			
			
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		//파일일 경우
		else {
			try {
				BasicFileAttributes attr = Files.readAttributes(pathd, BasicFileAttributes.class);

				//생성날짜 = 업로드날짜
				long lat2 = attr.creationTime().toMillis();
				Calendar cal2 = Calendar.getInstance();
				cal2.setTimeInMillis(lat2);
				int mYear2 = cal2.get(Calendar.YEAR);
				int mMonth2 = cal2.get(Calendar.MONTH);
				int mDay2 = cal2.get(Calendar.DAY_OF_MONTH);
				
				
				//최근 액세스 날짜
				long lat = attr.lastAccessTime().toMillis();
				Calendar cal = Calendar.getInstance();
				cal.setTimeInMillis(lat);
				
				int mYear = cal.get(Calendar.YEAR);
				int mMonth = cal.get(Calendar.MONTH);
				int mDay = cal.get(Calendar.DAY_OF_MONTH);

				/*int mHour = cal.get(Calendar.HOUR);
				int mMin = cal.get(Calendar.MINUTE);
				int mSec = cal.get(Calendar.SECOND);
				int mMilisec = cal.get(Calendar.MILLISECOND);*/
				
				String lastAccess = mYear + "년"+(mMonth+1)+"월"+mDay+ "일";
				String uploadDate = mYear2 + "년"+(mMonth2+1)+"월"+mDay2+ "일";
				
				
				//액세스날짜
				getFile.setLastModify(lastAccess);
				//파일명
				getFile.setFileName(f.getName());
				//파일크기
				getFile.setVolume(f.length());
				//업로드날짜
				getFile.setUploadDate(uploadDate);
			
			
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return getFile;
	}
	
	
	//속성
	@ResponseBody
	@RequestMapping(value="info", method=RequestMethod.POST)
		public FileFolder info(int ffid, HttpSession session){
			
		
		logger.info("너의 ffid는...? " + ffid);
		
		String email= (String)session.getAttribute("loginMem");
		
		FileFolder getFile = fileFolderDAO.boardread(ffid);
		
		System.out.println(getFile);
		File f = new File(getFile.getPath());
		
		Path pathd = Paths.get(getFile.getPath());
		
		if (f.isDirectory()) {
			try {
				BasicFileAttributes attr = Files.readAttributes(pathd, BasicFileAttributes.class);

				//최근 액세스 날짜
				long lat = attr.creationTime().toMillis();
				Calendar cal = Calendar.getInstance();
				cal.setTimeInMillis(lat);
				
				int mYear = cal.get(Calendar.YEAR);
				int mMonth = cal.get(Calendar.MONTH);
				int mDay = cal.get(Calendar.DAY_OF_MONTH);

				/*int mHour = cal.get(Calendar.HOUR);
				int mMin = cal.get(Calendar.MINUTE);
				int mSec = cal.get(Calendar.SECOND);
				int mMilisec = cal.get(Calendar.MILLISECOND);*/
				
				String lastAccess = mYear + "년"+(mMonth+1)+"월"+mDay+ "일";
				
				//
				getFile.setLastModify(lastAccess);
				//파일명
				getFile.setFileName(f.getName());
				
			
			
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		//파일일 경우
		else {
			try {
				BasicFileAttributes attr = Files.readAttributes(pathd, BasicFileAttributes.class);

				//생성날짜 = 업로드날짜
				long lat2 = attr.creationTime().toMillis();
				Calendar cal2 = Calendar.getInstance();
				cal2.setTimeInMillis(lat2);
				int mYear2 = cal2.get(Calendar.YEAR);
				int mMonth2 = cal2.get(Calendar.MONTH);
				int mDay2 = cal2.get(Calendar.DAY_OF_MONTH);
				
				
				//최근 액세스 날짜
				long lat = attr.lastAccessTime().toMillis();
				Calendar cal = Calendar.getInstance();
				cal.setTimeInMillis(lat);
				
				int mYear = cal.get(Calendar.YEAR);
				int mMonth = cal.get(Calendar.MONTH);
				int mDay = cal.get(Calendar.DAY_OF_MONTH);

				/*int mHour = cal.get(Calendar.HOUR);
				int mMin = cal.get(Calendar.MINUTE);
				int mSec = cal.get(Calendar.SECOND);
				int mMilisec = cal.get(Calendar.MILLISECOND);*/
				
				String lastAccess = mYear + "년"+(mMonth+1)+"월"+mDay+ "일";
				String uploadDate = mYear2 + "년"+(mMonth2+1)+"월"+mDay2+ "일";
				
				
				//액세스날짜
				getFile.setLastModify(lastAccess);
				//파일명
				getFile.setFileName(f.getName());
				//파일크기
				getFile.setVolume(f.length());
				//업로드날짜
				getFile.setUploadDate(uploadDate);
			
			
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return getFile;
	}
	
	// 컨텍스트메뉴 삭제기능
	@ResponseBody
	@RequestMapping(value="conDelete", method=RequestMethod.POST)
	public void conDelete(int ffid){
		int result = 0;
		System.out.print("ffid가 무엇이더냐 : "+ffid);
		try{
			result = fileFolderDAO.conDelete(ffid);
		}catch (Exception e) {
			// TODO: handle exception
			result = 1;
		}
	}
	
	@ResponseBody
	@RequestMapping(value="conRemove", method=RequestMethod.POST)
	public void conRemove(int ffid){
		int result = 0;
		System.out.print("ffid가 무엇이더냐 : "+ffid);
		try{
			result = fileFolderDAO.conRemove(ffid);
		}catch (Exception e) {
			// TODO: handle exception
			result = 1;
		}
	}
	
	@ResponseBody
	@RequestMapping(value="conAllRemove", method=RequestMethod.POST)
	public void conAllRemove(int ffid){
		FileFolder search2 = fileFolderDAO.boardread(ffid);
		int result = 0;
		int result1= 0;

		File f2 = new File(search2.getPath());
		File[] folder = f2.listFiles();
		
		if(search2 != null){
			if(f2.isDirectory()){
				for(int i=0; i<folder.length; i++){
					folder[i].delete();
					f2.delete();
				}
			}else if(f2.exists()){
				f2.delete();
			}
			result1 = fileFolderDAO.conBookDelete(ffid);
			result = fileFolderDAO.conAllRemove(ffid);
		}
	}
	/*
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
	}*/

}

