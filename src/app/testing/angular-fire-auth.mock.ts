import { Observable } from 'rxjs/Observable';

export class AngularFireAuthMock {
  user = 'Shani Laster';
  authState = Observable.of({ displayName: this.user });
  auth = {
    signInWithPopup(provider): Promise<any> {
      return Promise.resolve();
    },
    signOut(): Promise<any> {
      return Promise.resolve();
    }
  }
}
