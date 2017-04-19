package com.sc32c3.freemiere.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.sc32c3.freemiere.dao.FileFolderDAO;
import com.sc32c3.freemiere.dao.MemberDAO;
import com.sc32c3.freemiere.util.FileManager;
import com.sc32c3.freemiere.util.FileService;
import com.sc32c3.freemiere.util.ImageFileManager;
import com.sc32c3.freemiere.vo.FileFolder;
import com.sc32c3.freemiere.vo.Member;

@Controller
public class FileFolderController {

	private static final Logger logger = LoggerFactory.getLogger(FileFolderController.class);

	final String uploadPath = "/freemiere/"; // 파일 업로드 경로
	// xml에 설정된 리소스 참조
	// bean의 id가 uploadPath인 태그를 참조
	// @Resource(name="uploadPath")
	// String uploadPath;

	@Autowired
	FileFolderDAO fileFolderDAO;
	
	@Autowired
	   MemberDAO memberDAO;

	// @RequestMapping(value = "storage", method = RequestMethod.GET)
	// public String storage() {
	// System.out.println("??");
	// return "storage";
	// }

	@ResponseBody
	@RequestMapping(value = "loadTrash", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadTrash(HttpSession session) {
		logger.info("서버:loadTrash 실행 ");

		String email = (String) session.getAttribute("loginMem");
		ArrayList<FileFolder> rtn = fileFolderDAO.getTrashList(email);

		for (FileFolder ff : rtn) {
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
		}

		return rtn;
	}

	@ResponseBody
	@RequestMapping(value = "loadShared", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadShared(HttpSession session) {
		logger.info("서버:loadShared 실행 ");

		String email = (String) session.getAttribute("loginMem");
		ArrayList<FileFolder> rtn = fileFolderDAO.getSharedList(email);

		for (FileFolder ff : rtn) {
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
		}

		return rtn;
	}

	@ResponseBody
	@RequestMapping(value = "loadBookmark", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadBookmark(HttpSession session) {

		logger.info("서버:loadBookmark 실행 ");

		String email = (String) session.getAttribute("loginMem");
		ArrayList<FileFolder> myStorageList = fileFolderDAO.getMyStorageBookmarkList(email);
		ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedBookmarkList(email);
		myStorageList.addAll(sharedList);

		for (FileFolder ff : myStorageList) {
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
		}

		return myStorageList;
	}

	@ResponseBody
	@RequestMapping(value = "loadMyStorage", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadMyStorage(HttpSession session) {

		logger.info("서버:loadMyStorage 실행 ");

		String email = (String) session.getAttribute("loginMem");

		// ArrayList<FileFolder> myStorageList =
		// fileFolderDAO.getMyStorageList(email);

		ArrayList<FileFolder> myStorageList = loadList("c:\\freemiere\\" + email, session);
		ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedList(email);

		for (FileFolder ff : sharedList) {
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
		}

		myStorageList.addAll(sharedList);

		return myStorageList;
	}

	@ResponseBody
	@RequestMapping(value = "loadList", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadList(String path, HttpSession session) {

		logger.info("서버:loadList 실행 " + path);

		String email = (String) session.getAttribute("loginMem");

		String loadPath = path;
		if (path.charAt(path.length() - 1) != '\\')
			loadPath += "\\";
		System.out.println("1" + loadPath);
		File[] files = FileManager.findFile(loadPath);
		ArrayList<FileFolder> rtn = new ArrayList<>();

		FileManager.fileSort(files);

		for (File f : files) {
			String p = f.getAbsolutePath();
			if (f.isDirectory() == true)
				p += "\\";
			System.out.println("2" + p);
			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email);
			if (ff == null)
				continue;
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
			rtn.add(ff);
		}

		return rtn;
	}

	// 휴지통으로 이동
	@ResponseBody
	@RequestMapping(value = "deleteFileFolder", method = RequestMethod.POST)
	public int deleteFileFolder(String[] ffid, String[] isshared, String[] bookState, HttpSession session) {

		logger.debug("ffid={}", ffid);
		logger.debug("issshared{}", isshared);
		logger.debug("book{}", bookState);

		int result = 0;
		String email = (String) session.getAttribute("loginMem");

		for (int i = 0; i < isshared.length; i++) {

			// 공유 아닌 파일
			if (isshared[i].equalsIgnoreCase("F")) {
				if (bookState[i].equalsIgnoreCase("F")) {
					fileFolderDAO.deleteFileFolder(Integer.parseInt(ffid[i]));
				} else {
					// 공유는 아니고 북파크 표시 폴더
					fileFolderDAO.deleteBookmarks(Integer.parseInt(ffid[i]), bookState[i]);
					fileFolderDAO.deleteFileFolder(Integer.parseInt(ffid[i]));
				}
			} else if (isshared[i].equalsIgnoreCase("T")) {
				if (bookState[i].equalsIgnoreCase("T")) {
					// 공유&북마크폴더
					fileFolderDAO.deleteShare(Integer.parseInt(ffid[i]), email);
					fileFolderDAO.deleteBookmarks(Integer.parseInt(ffid[i]), bookState[i]);
				} else {
					fileFolderDAO.deleteShare(Integer.parseInt(ffid[i]), email);
				}
			}
		}

		return result;
	}

	// 파일폴더업로드
	@ResponseBody
	@RequestMapping(value = "fileUpload", method = RequestMethod.POST)
	public void upload(HttpSession session, MultipartHttpServletRequest upload, String nowPath) {

		if (upload == null)
			System.out.println("폭신폭신 식빵");

		String email = (String) session.getAttribute("loginMem");
		if (nowPath.equals("root"))
			nowPath = "c:\\freemiere\\" + email + "\\";

		Iterator<String> filesName = upload.getFileNames();
		while (filesName.hasNext()) {

			List<MultipartFile> multiFiles = upload.getFiles(filesName.next());

			for (int i = 0; i < multiFiles.size(); i++) {
				System.out.println("길이" + multiFiles.size());
				if (!multiFiles.get(i).isEmpty()) {
					FileFolder file = new FileFolder();

					String savefile = FileService.saveFile(multiFiles.get(i), nowPath);

					file.setFileName(savefile);
					file.setPath(nowPath + savefile);
					file.setEmail(email);

					fileFolderDAO.upload(file);

					// sms 썸네일 추가. 파일 실제로 삭제 할때 함께 삭제 해야됨~!
					// 썸네일 파일 규칙 (영상 + 이미지) : (원본파일이름.확장자.png)
					String ext = ImageFileManager.checkImageFile(savefile);
					if (ext != null) {
						ImageFileManager.saveImageFile(ImageFileManager.resizeImageHighQuality(nowPath + savefile), ext,
								nowPath + ".thumb\\" + savefile + ".png");
					} else if (ImageFileManager.checkVideoFile(savefile) != null) {
						ImageFileManager.videoThumbGender(nowPath + savefile, nowPath + ".thumb\\" + savefile + ".png");
						ImageFileManager.saveImageFile(
								ImageFileManager.resizeImageHighQuality(nowPath + ".thumb\\" + savefile + ".png"),
								"png", nowPath + ".thumb\\" + savefile + ".png");
					}

				} // if
			} // for
		} // while
	}

	// 테스트 페이지 콘츄-롤라
	@RequestMapping(value = "test", method = RequestMethod.GET)
	public String test() {
		return "test";
	}

	// 새폴더
	@ResponseBody
	@RequestMapping(value = "newDir", method = RequestMethod.POST)
	public void newDir(String folderName, String path, HttpSession session) {
		logger.debug("folderName : {}", folderName);
		logger.debug("path : {}", path); // nowPath 현재의 경로
		System.out.println("찌찌파티");
		File directory = new File(path + folderName + "\\");
		if (directory.exists() && directory.isFile()) {
			System.out.println("찌찌파티");
		} else {
			try {
				if (!directory.exists()) {
					// 파일을 확인 후 없으면 폴더를 생성한다.
					// mkdirs는 트리구조의 디렉토리를 생성할 수 있다.
					boolean mkdirRst = directory.mkdirs();
					if (mkdirRst == true) {
						String email = (String) session.getAttribute("loginMem");
						fileFolderDAO.newDir(path + folderName + "\\", email);

						// sms - 썸네일 폴더 만들기
						File newThumbFolder = new File(path + folderName + "\\" + "." + "thumb\\");
						if (!newThumbFolder.exists())
							newThumbFolder.mkdirs();
					}
				} else {
					System.out.println("이거 실화냐?");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}


	// 휴지통에서 삭제
	@ResponseBody
	@RequestMapping(value = "completeDeleteFileFolder", method = RequestMethod.POST)
	public void completeDeleteFileFolder(String[] path, HttpSession session) {
		String email = (String) session.getAttribute("loginMem");

		for (int i = 0; i < path.length; i++) {
			ArrayList<File> fileList = new ArrayList<>();
			FileManager.getAllSubFile(path[i], fileList);
			fileFolderDAO.completeDelete(fileList, email);
		}
	}

	// 복원
	@ResponseBody
	@RequestMapping(value = "restore", method = RequestMethod.POST)
	public void resotre(String[] path) {
		System.out.println("복원갯수:"+path.length);
		for(int i=0; i< path.length;i++){
			ArrayList<File> reFileList = new ArrayList<>();
			FileManager.getAllSubFile(path[i], reFileList);
			fileFolderDAO.restore(reFileList);
			
		}
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
	   
	   
	   //속성내부에서 수정하기 기능
	   @ResponseBody
	   @RequestMapping(value="sokUpdate", method=RequestMethod.POST)
	   public FileFolder sokUpdate(int ffid, String info, String filename,String path){
	      
	      FileFolder result = fileFolderDAO.boardread(ffid);
	      String path1 = path + filename;
	      String path2 = path1 + File.separator;
	      
	      System.out.println("path2야 !!!!!!!!!1" + path2);
	      File f = new File(result.getPath());
	      File movePath = new File(path1);
	      File movePath2 = new File(path2);
	      int fol = 0;
	      
	      //폴더일경우
	      if(f.isDirectory()){
	         if(result != null){
	            
	            try{
	               //디렉토리 파일내에서 이름변경 
	               f.renameTo(movePath2);
	               
	               //DB update
	               fol = fileFolderDAO.sokUpdate(ffid,info,path2);
	               //Filename VO에 담음.
	               result.setFileName(filename);
	            }catch (Exception e) {
	               fol = 0;
	            }
	         }
	      }
	      //파일일경우
	      else{
	         if(result != null){
	            
	            try{
	               //디렉토리 파일내에서 이름변경 
	               f.renameTo(movePath);
	               
	               //DB update
	               fol = fileFolderDAO.sokUpdate(ffid,info,path1);
	               //Filename VO에 담음.
	               result.setFileName(filename);
	            }catch (Exception e) {
	               fol = 0;
	            }
	         }
	      }
	      
	      
	      
	      
	      
	      return result;
	   }
	   
	   
	   
	   //폴더공유버튼
	   @ResponseBody
	   @RequestMapping(value="folderShare", method=RequestMethod.POST)
	   public ArrayList<FileFolder> folderShare(int ffid){
	      
	      System.out.println("ffid : " + ffid);
	      ArrayList<FileFolder> rtn = fileFolderDAO.shareList(ffid);
	      System.out.println("얘두라 나오렴~{}"+rtn);
	      return rtn;
	   }
	   
	   //폴더공유버튼
	      @ResponseBody
	      @RequestMapping(value="folderShare2", method=RequestMethod.POST)
	      public FileFolder folderShare2(int ffid){
	         
	         System.out.println("ffid : " + ffid);
	         FileFolder rtn = fileFolderDAO.boardread(ffid);
	         System.out.println("얘두라 나오렴~{}"+rtn);
	         return rtn;
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
	   
	   //폴더 공유눌렀을경우 사용자 검색
	   @ResponseBody
	   @RequestMapping(value="searchUser", method=RequestMethod.POST)
	   public Member searchUser(String email){
	      
	      
	      System.out.print("email이 무엇이더냐 : "+ email);
	      Member search = memberDAO.getMember(email);
	      
	      return search;
	   }
	 //폴더 공유 권한 설정하였을때 행해지는 것들
	      @ResponseBody
	      @RequestMapping(value="setAuth", method=RequestMethod.POST, produces = "application/text; charset=utf8")
	      public String setAuth(int ffid, String auth, String email, HttpSession session){
	         
	      String myEmail = (String)session.getAttribute("loginMem");
	      int insertResult = 0;
	      int updateResult = 0;
	      FileFolder search = fileFolderDAO.searchShare(ffid, email);
	      int updateFileFolder = 0;
	      int firstOwner = 0;
	      String message = null;
	      int updateOwner = 0;
	      
	      //만약 auth값이 owner일 경우 shares에서 view로 변경이 되게 만들어버림...
	      //만약 공유버튼 눌렀을 때의 나자신이 OWNER가 아닐경우, null던져버려야겠음...
	      
	      if(auth.equals("OWNER")){
	         
	         updateResult = fileFolderDAO.updateAuth(ffid, email, auth);
	         updateOwner = fileFolderDAO.updateOwner(ffid, myEmail, auth);
	         
	         message = "권한이 변경되었습니다.";
	         return message;
	      }
	      else{
	         if (search != null){
	            try{
	               updateResult = fileFolderDAO.updateAuth(ffid, email, auth);
	               message = "변경되었습니다.";
	            }catch (Exception e) {
	               e.printStackTrace();
	               // TODO: handle exception
	            }
	         }else{
	            try {
	               firstOwner = fileFolderDAO.firstOwner(ffid, myEmail);
	               updateFileFolder = fileFolderDAO.updateFileShare(ffid);   
	               insertResult = fileFolderDAO.shareInsert(ffid, email, auth);
	               message = "변경되었습니다.";
	            } catch (Exception e) {
	               e.printStackTrace();
	            }
	         }
	      }
	         
	         return message;
	      }
	      
	      
	      @ResponseBody
	      @RequestMapping(value="getData", method=RequestMethod.POST)
	      public FileFolder getData(int ffid){
	         
	         System.out.println("ffid : " + ffid);
	         FileFolder rtn = fileFolderDAO.boardread(ffid);
	         System.out.println("얘두라 나오렴~{}"+rtn);
	         return rtn;
	      }
	   

}
