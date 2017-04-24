package com.sc32c3.freemiere.util;

import java.awt.Dimension;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.PixelGrabber;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;


/**
 * 
 * @author minsu
 * 썸네일 관련 클래스 추가.
 */
public class ImageFileManager {
	
	//썸네일 이미지 크기 변경 하고 싶으면 이거 수정
	private static final Dimension thumb = new Dimension(156, 156);
	 
	private static enum ImageFileFormat { jpg, jpeg, png };
	private static enum VideoFileFormat { mp4, ogg, webm};
	
	public static Dimension getImgDownSize( Dimension origin, Dimension scale){
		double rate = Math.min(scale.getHeight() / origin.getHeight(), scale.getWidth() / origin.getWidth());
		
		double rstWidth = origin.getWidth() * rate;
		double rstHeight = origin.getHeight() * rate;
		Dimension rtn = new Dimension();
		rtn.setSize(rstWidth, rstHeight);
		return rtn;
	}
	
	public static String checkImageFile(String fileName){
		int idx = fileName.lastIndexOf(("."));
		String ext = fileName.substring(idx + 1);
		
		String rtn = null;
		for(ImageFileFormat format : ImageFileFormat.values()){
			if(format.name().equalsIgnoreCase(ext)) {
				rtn = new String(ext);
				break;
			}
        }

		return rtn;
	}

	public static String checkVideoFile(String fileName){
		int idx = fileName.lastIndexOf(("."));
		String ext = fileName.substring(idx + 1);
		
		String rtn = null;
		for(VideoFileFormat format : VideoFileFormat.values()){
			if(format.name().equalsIgnoreCase(ext)) {
				rtn = new String(ext);
				break;
			}
        }

		return rtn;
	}

	
	public static BufferedImage resizeImageHighQuality(String orgImgPath)  {
		BufferedImage originalImage;
		try {
			System.out.println("어디야 : " + orgImgPath );
			originalImage = ImageIO.read(new File(orgImgPath));
			Dimension origin = new Dimension();
			origin.setSize(originalImage.getWidth(), originalImage.getHeight());
				
			Dimension rtn = getImgDownSize(origin, thumb);
				
			Image image = originalImage.getScaledInstance((int)rtn.getWidth(), (int)rtn.getHeight(), Image.SCALE_SMOOTH);
			int pixels[] = new int[(int)rtn.getWidth() * (int)rtn.getHeight()];
			PixelGrabber pixelGrabber = new PixelGrabber(image, 0, 0, (int)rtn.getWidth(), (int)rtn.getHeight(), pixels, 0, (int)rtn.getWidth());
			pixelGrabber.grabPixels();
				 
			BufferedImage destImg = new BufferedImage((int)rtn.getWidth(), (int)rtn.getHeight(), originalImage.getType());
			destImg.setRGB(0, 0, (int)rtn.getWidth(), (int)rtn.getHeight(), pixels, 0, (int)rtn.getWidth());
				 
			return destImg;
						
		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static void saveImageFile(BufferedImage img, String ext, String destPath){
		try {
			ImageIO.write(img, ext, new File(destPath));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static void videoThumbGender(String originPath, String thumbPath){
		Runtime run = Runtime.getRuntime();
		
		String command = "C:\\ffmpeg\\bin\\ffmpeg.exe -i \""
				+originPath+"\" -ss 5 -vcodec png \""
				+thumbPath+"\"";
		
		//System.out.println(command);
		try{
			run.exec("cmd.exe chcp 65001");
			Process process = run.exec(command);
			process.getErrorStream().close(); 
			process.getInputStream().close(); 
			process.getOutputStream().close(); 
			process.waitFor(); 
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public static void extractVideo(String originPath, int ffid){
		Thread thread = new Thread(() -> {
			Runtime run = Runtime.getRuntime();
			//int a = VideoInfo.getVideoFrameRate(originPath);
			//System.out.println("이미지 자릿수 : " + a);
			File dir = new File("c:\\freemiere\\videoExtract\\" + ffid +"\\");
			dir.mkdirs();
			
			String command = "ffmpeg -i "
					+ originPath
					+ " -r 30 -qscale:v 1 "
					+ "c:\\freemiere\\videoExtract\\" + ffid +"\\%09d.jpg";
			
			String command2 = "ffmpeg -y -i "
					+ originPath
					+ " -vn -acodec libmp3lame -ar 44.1k -ac 2 -ab 128k "
					+ "c:\\freemiere\\videoExtract\\" + ffid +"\\audio.mp3";
			
			//System.out.println("command : " + command);
			try{
				run.exec("cmd.exe chcp 65001");
				Process process = run.exec(command);
				process.getErrorStream().close(); 
				process.getInputStream().close(); 
				process.getOutputStream().close(); 
				process.waitFor(); 
				run.exec(command2);
			}catch(Exception e){
				e.printStackTrace();
			}			
		});
		thread.start();
	}
}
