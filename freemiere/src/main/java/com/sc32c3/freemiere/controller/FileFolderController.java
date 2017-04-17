package com.sc32c3.freemiere.controller;

import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.rmi.server.SocketSecurityException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sc32c3.freemiere.dao.FileFolderDAO;
import com.sc32c3.freemiere.util.FileManager;
import com.sc32c3.freemiere.util.FileService;
import com.sc32c3.freemiere.util.ImageFileManager;
import com.sc32c3.freemiere.vo.FileFolder;

@Controller
public class FileFolderController {

	private static final Logger logger = LoggerFactory.getLogger(FileFolderController.class);

	// xml에 설정된 리소스 참조
	// bean의 id가 uploadPath인 태그를 참조
	// @Resource(name="uploadPath")
	// String uploadPath;

	@Autowired
	FileFolderDAO fileFolderDAO;

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
	@RequestMapping(value = "loadRecent", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public HashMap<String, Object> loadRecent(
			String path,
			HttpSession session) {
		logger.info("서버:recentList 실행 " + path);
		String email = (String) session.getAttribute("loginMem");
		
		 
		HashMap<Integer, FileFolder> all = new HashMap<>();
		//ArrayList<FileFolder> all = new ArrayList<>();// 파일 하나하나가 담길 리스트

		ArrayList<File> myStorageList = new ArrayList<>();// 사용자 컴퓨터의 파일을 담을 리스트
		
		FileManager.findFileRecursive("c:\\freemiere\\" + email, myStorageList);

		ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedList(email);
		// 아래 for문 안에서 findfilerecursive 함수를 호출 하여 모든 파일을 읽어 mystoragelist에
		// add한다.
		for (FileFolder ff : sharedList) {
			FileManager.findFileRecursive(ff.getPath(), myStorageList);// findfilerecursive함수호출
		}
		//DateFormat datepasing = DateFormat.getDateInstance(DateFormat.MEDIUM);
		
		DateFormat format3 = DateFormat.getDateInstance(DateFormat.MEDIUM);
		// vo에 수정날짜 추가. updatedate 추가함
		
		for (File f : myStorageList) {
			String p = f.getAbsolutePath();
			if (f.isDirectory() == true)
				p += "\\";
			
			Date updatedate = new Date(f.lastModified());//모디파이 날짜 형식을 바꿈
			String momodate = format3.format(updatedate);//모드파이 날짜의 형식을 바꾼다 
			

			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email);
			if (ff == null)
				continue;
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());//파일 이름을 저장한다
			ff.setStrUpdate(format3.format(updatedate));//바뀐형식의  모디파이 날짜를 vo에 저장한다
			ff.setLnUpdate(f.lastModified());
			
			all.put(ff.getFfid(), ff);
			//여기까지 파일 가져오는 부분
		}
		System.out.println("해쉬맴에 담긴 파일"+ all);
		//가져온 파일을 해쉬맴으로 날짜별로 구분해보자 
		//ArrayList<String> dateinfo = new ArrayList<>();
		HashSet<String> dateinfo = new HashSet<>();//날짜정보를 저장할 해시샛, 중복이 허용되지 않아 저장된 중복값은 하나로 된다
		HashMap<String, Object> dateFile = new HashMap<>();
		
		ArrayList<FileFolder> rtn = new ArrayList<FileFolder>(all.values());//모든 파일 정보를 array리스트에 넣는다
		//날짜 정보 저장
		for (FileFolder fileFolder : rtn) {//모든 파일 정보의 날짜 정보를 하나씩 꺼내 hashset에 넣는다. 
			dateinfo.add(fileFolder.getStrUpdate());//날짜정보를 담고 있다 
		}
		System.out.println("날짜정보" + dateinfo);
		
		
		for (String date : dateinfo) {//날짜 정보가 담긴 dateinfo에서 날짜를 하나씩 꺼내본다
		//for (int i=0; i<dateinfo.size(); i++){
			ArrayList<FileFolder> dateFile2 = new ArrayList<>();	
			//String date = dateinfo.get(i);
		for (FileFolder fileFolder : rtn) {//모든 파일 정보를 하나씩 꺼내면서
			if(date.equals(fileFolder.getStrUpdate())){// 날짜 정보와 비교하여 같으면 
					dateFile2.add(fileFolder);//array리스트에 넣는다.
			 	}//if
			}//inner for
		//dateFile.put("length", dateinfo.size());
		//dateFile.put("date" + i, dateFile2);
		System.out.println("해쉬맵의 키값으로 있는 date" + date);
		System.out.println("해쉬맵의 날짜정보를 array에 넣음" + dateFile2);//테스트 출력해보자

		dateFile.put(date, dateFile2);//해쉬맵에 날짜를 키값으로 하고 그날짜에 해당되는  파일 정보(datefile2)를 담는다.
		//해당 날짜에 대한 파일을 가지고 있다 
		}
		
		System.out.println("해쉬맵에 최종 저장 파일??"+ dateFile);
		//테스트 출력 해봄
		/*for (String  date : dateinfo) {//날짜를 가져온다
			ArrayList<FileFolder> test = (ArrayList<FileFolder>) dateFile.get(date);//가져온 날짜를 어레이 리스트에 넣는다.
			System.out.println("날짜 : " +date );//날짜를 출력해본다
			for (FileFolder fileFolder : test) {//가져온 날짜에 해당하는 파일을 모두 가져온다 
				System.out.println(fileFolder);//그 날짜에 해당되는 파일을 출력해본다
			}
			
		}*/
	
		
		Collections.sort(rtn);//오른차순 솔트
		//Iterator<String> filesort = dateFile.keySet().iterator();//해수맵 정렬이라는데....
		//Collections.reverse(rtn);내 림차순 솔트
		
		return dateFile;
		
		// myStorageList for문 돌면서 각각 파일의 정보를 db에서 가져온다
		// db에서 가져 오면서 FileFolder 객체를 만들어(필드 셋팅) all 에 넣어준다.
		// ArrayList<FileFolder> all 을 FileFolder의 필드인 수정 날짜로 정렬 하는 함수를 만든다.
		// 위 함수로 all을 정렬

		/*
		 * 레코드의 변경시간 조회 SELECT ora_rowscn , scn_to_timestamp(ora_rowscn) FROM
		 * 테이블;
		 */

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

			/*
			 * SimpleDateFormat sf = new
			 * SimpleDateFormat("yyyy-MM-dd / HH:mm:ss");//파일 수정 날짜 확인
			 * System.out.println(sf.format(f.lastModified()));
			 */
		}
		
		return rtn;
	}
	/*@ResponseBody
	@RequestMapping(value = "loadSearch", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadSrarch(String title, HttpSession session) {
	//검색기능
		logger.info("서버:loadSearch 실행 ");

		String email = (String) session.getAttribute("loginMem");
		ArrayList<FileFolder> searchall = new ArrayList<>();

		ArrayList<FileFolder> myStorageList = loadList("c:\\freemiere\\" + email, session);
		ArrayList<FileFolder> sharedList = fileFolderDAO.getSearchList(email);

		for (FileFolder ff : sharedList) {
			if(title.equals(ff.getPath())){
				
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
			searchall.add(ff);
			}
			else {
				System.out.println("검색결과 없음");
			}
		}
		return searchall;
	}*/
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

	
	
	
	/*
	 * @ResponseBody//동영상 편집 화면이동
	 * 
	 * @RequestMapping(value = "loadEdit", method = RequestMethod.GET , produces
	 * = "application/json;charset=utf-8") public ArrayList<FileFolder>
	 * loadEdit(HttpSession session){ logger.info("서버:loadEdit 실행 ");
	 * 
	 * String email= (String)session.getAttribute("loginMem");
	 * 
	 * return editForm; }
	 */
		// 파일폴더업로드
	@ResponseBody
	@RequestMapping(value = "fileUpload", method = RequestMethod.POST)
	public void upload(HttpSession session, MultipartHttpServletRequest upload, String nowPath) {

		if (upload == null)
			System.out.println("폭신폭신 식빵");
		
		String email = (String) session.getAttribute("loginMem");
		if(nowPath.equals("root")) nowPath = "c:\\freemiere\\" + email + "\\"; 
		
	
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
					
					
					//sms 썸네일 추가. 파일 실제로 삭제 할때 함께 삭제 해야됨~!
					//썸네일 파일 규칙 (영상 + 이미지) : (원본파일이름.확장자.png)
					String ext = ImageFileManager.checkImageFile(savefile);
					if(ext != null){
						ImageFileManager.saveImageFile(
								ImageFileManager.resizeImageHighQuality(nowPath + savefile)
								, ext
								, nowPath+".thumb\\"+savefile+".png");
					}
					else if (ImageFileManager.checkVideoFile(savefile) != null) {
						ImageFileManager.videoThumbGender(nowPath + savefile,
								nowPath+".thumb\\"+savefile+".png");
						ImageFileManager.saveImageFile(
								ImageFileManager.resizeImageHighQuality(nowPath+".thumb\\"+savefile+".png")
								, "png"
								, nowPath+".thumb\\"+savefile+".png");
					}
						
				}//if
			}//for
		}//while
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
		logger.debug("path : {}", path); //nowPath 현재의 경로
		System.out.println("찌찌파티");
		File directory = new File(path + folderName + "\\");
		if (directory.exists() && directory.isFile()) {
			System.out.println("찌찌파티");
		} else {
			try {
				if (!directory.exists()) {
					//파일을 확인 후 없으면 폴더를 생성한다.
					//mkdirs는 트리구조의 디렉토리를 생성할 수 있다.
					boolean mkdirRst = directory.mkdirs();
					if (mkdirRst == true) {
						String email = (String) session.getAttribute("loginMem");
						fileFolderDAO.newDir(path + folderName + "\\", email);
						
						//sms - 썸네일 폴더 만들기
						File newThumbFolder = new File(path + folderName + "\\" + "." + "thumb\\");
						if(!newThumbFolder.exists())
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

	@RequestMapping(value = "saveFile", method = RequestMethod.GET)
	public String saveFile(String path, HttpServletResponse response) throws Exception {

		fileFolderDAO.saveFile(path+"\\");
		// 원래의 파일명을 보여준다.
		response.setHeader("Content-Disposition",
				"attachment;filename=" + URLEncoder.encode("UTF-8"));

		// 서버에 저장된 파일을 읽어서
		// 클라이언트로 전달할 줄력 스트림으로 복사
		String fullPath = path + "/";
		FileInputStream in = new FileInputStream(fullPath);
		ServletOutputStream out = response.getOutputStream();

		FileCopyUtils.copy(in, out);
		in.close();
		out.close();

		return null;
	}
	
	//휴지통에서 삭제
	@ResponseBody
	@RequestMapping(value="completeDeleteFileFolder", method = RequestMethod.POST)
	public void completeDeleteFileFolder(String[] ffid
										,String[] path){

		for(int i=0; i<ffid.length;i++){
			File file = new File(path[i]);
			System.out.println(file.listFiles());
			//폴더&하위 폴더파일 삭제
			if(file.isDirectory()){
				File[] fileList = file.listFiles();
				for(int j=0; j<fileList.length; j++){
					if(fileList[j].isFile()){
						fileList[j].delete();
					}
					if(fileList[j].isDirectory()){
						
					}
				}
				file.delete();
			}else{
				//파일 삭제
				FileService.deleteFile(path[i]);
			}
			//DB에서 컬럼삭제
			fileFolderDAO.completeDeleteFileFolder(Integer.parseInt(ffid[i]));
		}
	}
/*	
//복원
	@ResponseBody
	@RequestMapping(value="restore", method=RequestMethod.POST)
	public int resotre(String[] ffid){
		
		fileFolderDAO.restore(ffid);
		return 0;
	}
	*/
	
}
